// scripts/after-build.mjs
// HTMLを後処理して <img> を <picture> 化し、width/height を自動付与します。
// config/site.config.js の imageAltFormats に従い、挿入する代替フォーマット（webp/avif）を制御します。

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'
import beautify from 'js-beautify'
import { siteConfig } from '../config/site.config.js'

const DIST = 'dist'

// 挿入対象フォーマット（picture 内の並びは AVIF → WebP）
const imageAltFormats = siteConfig.imageAltFormats
const injectFormats = imageAltFormats === 'none' ? [] : imageAltFormats === 'webp' ? ['webp'] : imageAltFormats === 'avif' ? ['avif'] : ['avif', 'webp']
const injectWebp = injectFormats.includes('webp')
const injectAvif = injectFormats.includes('avif')

function listHtmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const fp = join(dir, name)
    const st = statSync(fp)
    if (st.isDirectory()) listHtmlFiles(fp, out)
    else if (name.toLowerCase().endsWith('.html')) out.push(fp)
  }
  // console.log('[after-build] html files:', out.map(p => p.replace(process.cwd() + '/', '')))
  return out
}

function toDistAbsFromHtml(htmlPath, src) {
  if (!src || /^https?:\/\//i.test(src) || /^data:/i.test(src)) return null
  if (src.startsWith('/')) return resolve(DIST, src.slice(1))
  return resolve(dirname(htmlPath), src)
}

function toDistRel(absPath) {
  const rel = relative(resolve(DIST), absPath).replaceAll('\\', '/')
  return rel.startsWith('.') ? null : rel
}

// foo-xxx.jpg -> [foo-xxx.webp, foo-xxx.jpg.webp]
function candidates(relPath, exts) {
  const baseNoExt = relPath.replace(/\.(jpe?g|png|gif)(?:\?.*)?$/i, '')
  const extMatch = relPath.match(/\.(jpe?g|png|gif)(?:\?.*)?$/i)
  const origExt = extMatch ? extMatch[0] : '' // 例: .jpg
  const out = []
  for (const ext of exts) {
    out.push(baseNoExt + '.' + ext)              // foo-xxx.webp
    if (origExt) out.push(relPath.replace(origExt, origExt + '.' + ext)) // foo-xxx.jpg.webp
  }
  return Array.from(new Set(out))
}

function firstExisting(relList) {
  for (const rel of relList) {
    const abs = resolve(DIST, rel)
    if (existsSync(abs)) return { rel, abs }
  }
  return null
}

function firstUrlFromSrcset(ss) {
  if (!ss) return ''
  const first = ss.split(',')[0].trim()
  const url = first.split(/\s+/)[0]
  return url || ''
}

function urlToRelFromHtml(htmlPath, url) {
  const abs = toDistAbsFromHtml(htmlPath, url)
  if (!abs) return null
  return toDistRel(abs)
}

async function metaForSrcsetUrl(ss, htmlPath) {
  const url = firstUrlFromSrcset(ss)
  if (!url) return null
  const abs = toDistAbsFromHtml(htmlPath, url)
  if (!abs || !existsSync(abs)) return null
  try { return await sharp(abs).metadata() } catch { return null }
}

function applySize(el, meta) {
  if (meta?.width && meta?.height) {
    el.setAttribute('width', String(meta.width))
    el.setAttribute('height', String(meta.height))
    // Debug log: confirm width/height applied to <source>
    // if (el.tagName && el.tagName.toLowerCase() === 'source') {
    //   console.log('    [debug] width/height set on <source>', el.getAttribute('type') || '', `${meta.width}x${meta.height}`)
    // }
  }
}

// プレフィックス付きロゴ（common_logo-xxx.svg, demo_logo-xxx.svg）または同名で1つにまとまった logo-xxx.svg を解決
const imagesDir = join(resolve(DIST), 'assets', 'images')
const logoMap = {}
if (existsSync(imagesDir)) {
  let fallbackLogo = null
  for (const name of readdirSync(imagesDir)) {
    if (/^common_logo-.+\.svg$/i.test(name)) logoMap['common/logo.svg'] = name
    if (/^demo_logo-.+\.svg$/i.test(name)) logoMap['demo/logo.svg'] = name
    if (/^logo-.+\.svg$/i.test(name)) fallbackLogo = name
  }
  if (fallbackLogo) {
    if (!logoMap['common/logo.svg']) logoMap['common/logo.svg'] = fallbackLogo
    if (!logoMap['demo/logo.svg']) logoMap['demo/logo.svg'] = fallbackLogo
  }
}

const htmlFiles = listHtmlFiles(DIST)
let converted = 0
let sizedOnly = 0

for (const htmlPath of htmlFiles) {
  let html = readFileSync(htmlPath, 'utf8')
  // EJS で出力した common/logo.svg, demo/logo.svg をビルド後のファイル名に置換
  for (const [logical, actual] of Object.entries(logoMap)) {
    html = html.replace(new RegExp(logical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), actual)
  }
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const imgs = [...doc.querySelectorAll('img[src]:not([data-no-picture])')]
  // console.log(`[after-build] scanning ${htmlPath.replace(process.cwd() + '/', '')} (imgs: ${imgs.length})`)

  for (const img of imgs) {
    const srcAttr = img.getAttribute('src') || ''
    const insidePicture = !!(img.parentElement && img.parentElement.tagName && img.parentElement.tagName.toLowerCase() === 'picture')
    try {
      if (!/\.(jpe?g|png|gif)(?:\?.*)?$/i.test(srcAttr)) continue

      const abs = toDistAbsFromHtml(htmlPath, srcAttr)
      if (!abs || !existsSync(abs)) {
        // console.log('  - skip (not found):', srcAttr)
        continue
      }

      // width/height 自動付与（<picture> 内でも行う）
      let meta = null
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        meta = await sharp(abs).metadata().catch(() => null)
        if (meta?.width && meta?.height) {
          applySize(img, meta)
          // console.log('  - size set:', srcAttr, `${meta.width}x${meta.height}`)
        }
      } else {
        meta = await sharp(abs).metadata().catch(() => null)
      }

      // 既に <picture> 内なら、ラップはしないが設定で有効な WebP/AVIF の <source> を不足分だけ挿入する
      if (insidePicture) {
        const pictureEl = img.parentElement

        const hasWebp = !!pictureEl.querySelector('source[type="image/webp"]')
        const hasAvif = !!pictureEl.querySelector('source[type="image/avif"]')

        const distRel = toDistRel(abs)
        if (distRel) {
          const webpCand = injectWebp && !hasWebp ? candidates(distRel, ['webp']) : null
          const avifCand = injectAvif && !hasAvif ? candidates(distRel, ['avif']) : null
          const foundWebp = webpCand ? firstExisting(webpCand) : null
          const foundAvif = avifCand ? firstExisting(avifCand) : null

          // 既存の art-direction（media 指定）を崩さないよう、フォールバック <img> の直前に差し込む（AVIF → WebP の順）
          if (foundAvif) {
            const s = doc.createElement('source')
            const relPath = relative(dirname(htmlPath), resolve(DIST, foundAvif.rel)).replaceAll('\\', '/')
            s.setAttribute('srcset', relPath.startsWith('.') ? relPath : './' + relPath)
            s.setAttribute('type', 'image/avif')
            const ownMetaAvif = await metaForSrcsetUrl(relPath, htmlPath)
            applySize(s, ownMetaAvif)
            pictureEl.insertBefore(s, img)
          }
          if (foundWebp) {
            const s = doc.createElement('source')
            const relPath = relative(dirname(htmlPath), resolve(DIST, foundWebp.rel)).replaceAll('\\', '/')
            s.setAttribute('srcset', relPath.startsWith('.') ? relPath : './' + relPath)
            s.setAttribute('type', 'image/webp')
            const ownMetaWebp = await metaForSrcsetUrl(relPath, htmlPath)
            applySize(s, ownMetaWebp)
            pictureEl.insertBefore(s, img)
          }

          // 既存の JPG/PNG <source>（art-direction の media 付き）に対し、有効なフォーマットの <source> を同じ media で追加（AVIF → WebP の順）
          const currentSources = Array.from(pictureEl.querySelectorAll('source'))
          for (const jpgSrc of currentSources) {
            const t = (jpgSrc.getAttribute('type') || '').toLowerCase()
            if (t === 'image/webp' || t === 'image/avif') continue
            const ss = jpgSrc.getAttribute('srcset') || ''
            const url = firstUrlFromSrcset(ss)
            if (!url) continue
            if (!/\.(jpe?g|png)(?:\?.*)?$/i.test(url)) continue
            const mediaAttr = jpgSrc.getAttribute('media') || ''
            const rel = urlToRelFromHtml(htmlPath, url)
            if (!rel) continue

            for (const fmt of ['avif', 'webp']) {
              if (fmt === 'avif' && !injectAvif) continue
              if (fmt === 'webp' && !injectWebp) continue
              const type = fmt === 'avif' ? 'image/avif' : 'image/webp'
              const cand = candidates(rel, [fmt])
              const found = firstExisting(cand)
              if (!found) continue

              const existingSameType = pictureEl.querySelectorAll(`source[type="${type}"]`)
              let existsSame = false
              for (const s of existingSameType) {
                const smedia = s.getAttribute('media') || ''
                const srel = urlToRelFromHtml(htmlPath, firstUrlFromSrcset(s.getAttribute('srcset') || ''))
                if (smedia === mediaAttr && srel === found.rel) { existsSame = true; break }
              }
              if (existsSame) continue

              const s = doc.createElement('source')
              const relPath = relative(dirname(htmlPath), resolve(DIST, found.rel)).replaceAll('\\', '/')
              s.setAttribute('srcset', relPath.startsWith('.') ? relPath : './' + relPath)
              s.setAttribute('type', type)
              if (mediaAttr) s.setAttribute('media', mediaAttr)
              const ownMeta = await metaForSrcsetUrl(relPath, htmlPath)
              applySize(s, ownMeta)
              pictureEl.insertBefore(s, jpgSrc)
            }
          }

          for (const sourceEl of pictureEl.querySelectorAll('source')) {
            const ss = sourceEl.getAttribute('srcset') || ''
            const ownMeta = await metaForSrcsetUrl(ss, htmlPath)
            applySize(sourceEl, ownMeta)
          }
        }

        sizedOnly++
        continue
      }

      const distRel = toDistRel(abs)
      if (!distRel) continue

      const foundAvif = injectAvif ? firstExisting(candidates(distRel, ['avif'])) : null
      const foundWebp = injectWebp ? firstExisting(candidates(distRel, ['webp'])) : null

      if (!foundWebp && !foundAvif) {
        sizedOnly++
        continue
      }

      const picture = doc.createElement('picture')
      if (foundAvif) {
        const s = doc.createElement('source')
        const relPath = relative(dirname(htmlPath), resolve(DIST, foundAvif.rel)).replaceAll('\\', '/')
        s.setAttribute('srcset', relPath.startsWith('.') ? relPath : './' + relPath)
        s.setAttribute('type', 'image/avif')
        const ownMetaAvif = await metaForSrcsetUrl(relPath, htmlPath)
        applySize(s, ownMetaAvif)
        picture.appendChild(s)
      }
      if (foundWebp) {
        const s = doc.createElement('source')
        const relPath = relative(dirname(htmlPath), resolve(DIST, foundWebp.rel)).replaceAll('\\', '/')
        s.setAttribute('srcset', relPath.startsWith('.') ? relPath : './' + relPath)
        s.setAttribute('type', 'image/webp')
        const ownMetaWebp = await metaForSrcsetUrl(relPath, htmlPath)
        applySize(s, ownMetaWebp)
        picture.appendChild(s)
      }

      for (const sourceEl of picture.querySelectorAll('source')) {
        const ss = sourceEl.getAttribute('srcset') || ''
        const ownMeta = await metaForSrcsetUrl(ss, htmlPath)
        applySize(sourceEl, ownMeta)
      }

      const cloned = img.cloneNode(false)
      applySize(cloned, meta)
      picture.appendChild(cloned)
      img.replaceWith(picture)
      converted++
      // console.log('  - replaced with <picture>:', srcAttr)
    } catch (e) {
      // console.warn('[after-build] skip:', srcAttr, e?.message || e)
    }
  }

  // シンプルな整形
  let out = dom.serialize()
  
  // ブール属性を簡潔な形式に変換（required="", checked="", disabled="" など）
  out = out.replace(/\s+(required|checked|disabled|readonly|multiple|selected|autofocus|autoplay|controls|loop|muted|novalidate|open|reversed|async|defer|hidden|ismap|itemscope|nomodule|playsinline|seamless|truespeed|crossorigin|inert)=""/g, ' $1')
    
  // <picture>タグの整形のみ
  out = out.replace(/(<picture[^>]*>)([\s\S]*?)(<\/picture>)/g, (m, open, inner, close) => {
    let formatted = inner
      .replace(/\s*(<source\b[^>]*>)/g, '\n    $1')
      .replace(/\s*(<img\b[^>]*>)/g, '\n    $1')
      .replace(/\n{2,}/g, '\n')
      .replace(/\n+\s*$/,'')
      .replace(/^\s*\n?/, '')
    return `${open}${formatted}\n  ${close}`
  })

  // js-beautifyで全体を整形
  out = beautify.html(out, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 0, // 空行をなくす
    preserve_newlines: true,
    end_with_newline: true,
    wrap_line_length: 0
  })

  writeFileSync(htmlPath, out)
  // console.log('rewrote:', htmlPath.split(sep).slice(-2).join('/'))
}

// === CSS: background-image / background の jpg/png → dist に WebP/AVIF があれば image-set を追加 ===
// config/site.config.js の imageAltFormats に従い、有効なフォーマットだけ image-set に含める（avif → webp → jpg の順）
const cssDir = join(resolve(DIST), 'assets', 'css')
const distImagesDir = join(resolve(DIST), 'assets', 'images')
if (existsSync(cssDir) && existsSync(distImagesDir)) {
  const cssFiles = readdirSync(cssDir).filter((n) => n.toLowerCase().endsWith('.css'))
  const imageFiles = readdirSync(distImagesDir)
  const imageExt = /\.(jpe?g|png)$/i
  const hashedBase = /^(.+)-[a-zA-Z0-9]+\.(jpe?g|png)$/i
  const resolveBgImage = (path) => {
    if (!imageExt.test(path)) return null
    let base
    let jpgFile
    if (path.includes('/')) {
      base = path.replace(/^.*\//, '').replace(imageExt, '')
      jpgFile = imageFiles.find((f) => f.startsWith(base + '-') && imageExt.test(f))
    } else {
      const m = path.match(hashedBase)
      base = m ? m[1] : path.replace(imageExt, '')
      jpgFile = path
    }
    if (!jpgFile) return null
    const webpFile = injectWebp ? imageFiles.find((f) => f.startsWith(base + '-') && f.toLowerCase().endsWith('.webp')) : null
    const avifFile = injectAvif ? imageFiles.find((f) => f.startsWith(base + '-') && f.toLowerCase().endsWith('.avif')) : null
    return { base, jpgFile, webpFile, avifFile }
  }
  const buildImageSet = (prefix, r) => {
    const parts = []
    if (r.avifFile) parts.push(`url(${prefix}${r.avifFile}) type("image/avif")`)
    if (r.webpFile) parts.push(`url(${prefix}${r.webpFile}) type("image/webp")`)
    parts.push(`url(${prefix}${r.jpgFile}) type("image/jpeg")`)
    if (parts.length <= 1) return null
    return `image-set(${parts.join(',')})`
  }
  for (const cssFile of cssFiles) {
    const cssPath = join(cssDir, cssFile)
    let css = readFileSync(cssPath, 'utf8')
    const bgImagePattern = /background-image:\s*url\((\.\.\/images\/)([^)]+)\)\s*([;}])/g
    const bgShorthandPattern = /background:\s*url\((\.\.\/images\/)([^)]+)\)\s*([^;]*);/g
    const newCss = css
      .replace(bgImagePattern, (match, prefix, path, terminator) => {
        const r = resolveBgImage(path)
        const imageSet = r ? buildImageSet(prefix, r) : null
        if (!imageSet) return match
        return `background-image:url(${prefix}${r.jpgFile});background-image:${imageSet};${terminator === '}' ? '}' : ';'}`
      })
      .replace(bgShorthandPattern, (match, prefix, path, rest) => {
        const r = resolveBgImage(path)
        const imageSet = r ? buildImageSet(prefix, r) : null
        if (!imageSet) return match
        return `background:url(${prefix}${r.jpgFile})${rest};background-image:${imageSet};`
      })
    if (newCss !== css) writeFileSync(cssPath, newCss)
  }
}

// console.log(`[after-build] picture化: ${converted} / 寸法のみ付与: ${sizedOnly}`)