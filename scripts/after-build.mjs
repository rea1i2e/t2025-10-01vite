// scripts/after-build.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'

const DIST = 'dist'

// --- 省略：あなたの最新ロジック（<img> → <picture> 化、webp/avif注入、size付与）をここに置く ---
// 既に使っている版をそのまま貼ってください。
// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// ……（中略）……
// DOMを書き戻す直前の「整形」だけ差し替え

function listHtmlFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const fp = join(dir, name)
    const st = statSync(fp)
    if (st.isDirectory()) listHtmlFiles(fp, out)
    else if (name.toLowerCase().endsWith('.html')) out.push(fp)
  }
  return out
}

const htmlFiles = listHtmlFiles(DIST)

for (const htmlPath of htmlFiles) {
  const html = readFileSync(htmlPath, 'utf8')
  const dom = new JSDOM(html)
  const doc = dom.window.document

  // ……（ここで picture 化や source 追加、width/height 付与の処理を実施）……

  // ==== 整形（空行が入らないようにする）====
  let out = dom.serialize()

  out = out.replace(/(<picture[^>]*>)([\s\S]*?)(<\/picture>)/g, (m, open, inner, close) => {
    // 各タグを1要素1行に整列
    let formatted = inner
      .replace(/\s*(<source\b[^>]*>)/g, '\n    $1')
      .replace(/\s*(<img\b[^>]*>)/g, '\n    $1')
      .replace(/\n{2,}/g, '\n')       // 連続改行は1行に
      .trim()                         // 先頭末尾の余白を削る（←空行の原因を消す）

    // 閉じタグ直前に空行を入れない
    return `${open}${formatted}\n  ${close}`
  })

  writeFileSync(htmlPath, out)
  console.log('rewrote:', htmlPath.split(sep).slice(-2).join('/'))
}

console.log('[after-build] done')