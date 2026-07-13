// src/assets/sass/components/ の SCSS を規約違反でフラグする（ソース静的チェック・ビルド不要）
// 基準: .cursor/rules/sass-block-file-variants.mdc（1ブロック1ファイル / data-* バリアント）
//   1. BEM modifier（.block--variant）を使っている → data-* へ
//   2. 1 ファイルに複数のルートブロックが同居 / ファイル名≠ブロック名
// 高シグナルな構造チェックのみ。reset 重複など判断が割れるものは .mdc の散文レビューに委ねる。
// 例外: _p-content.scss（WordPress the_content 出力領域）はネスト・要素セレクタ可のため対象外

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIR = join(ROOT, 'src', 'assets', 'sass', 'components')
const EXEMPT = new Set(['_p-content.scss']) // the_content() 出力領域

if (!existsSync(DIR)) {
  console.error(`❌  ${DIR} が見つかりません。`)
  process.exit(1)
}

// 行頭（インデントなし）で始まるルートブロックのクラス名。__ / -- / [ / . / : / 空白 で終端
const ROOT_BLOCK = /^\.(-?[a-z][a-z0-9-]*)/
// BEM modifier をセレクタとして使用（.block--variant）
const BEM_MODIFIER = /\.-?[a-z][a-z0-9-]*--[a-z0-9]/

const findings = []

for (const name of readdirSync(DIR).filter(f => f.endsWith('.scss')).sort()) {
  if (EXEMPT.has(name)) continue
  const lines = readFileSync(join(DIR, name), 'utf8').split('\n')

  const rootBlocks = new Set()
  const expected = basename(name, '.scss').replace(/^_/, '') // 期待ブロック名

  lines.forEach((line, i) => {
    if (ROOT_BLOCK.test(line)) {
      // .block__el / .block--mod を素のブロック名へ正規化
      const base = line.match(ROOT_BLOCK)[1].split('__')[0].split('--')[0]
      rootBlocks.add(base)
    }
    const trimmed = line.trim()
    if (BEM_MODIFIER.test(line) && !trimmed.startsWith('//') && !trimmed.startsWith('*') && !trimmed.startsWith('/*')) {
      findings.push({ name, n: i + 1, kind: 'modifier', detail: trimmed })
    }
  })

  if (rootBlocks.size > 1) {
    findings.push({ name, n: 0, kind: 'multiblock', detail: `複数ルートブロック: ${[...rootBlocks].join(', ')}` })
  } else if (rootBlocks.size === 1 && !rootBlocks.has(expected)) {
    findings.push({ name, n: 0, kind: 'filename', detail: `ファイル名≠ブロック名: .${[...rootBlocks][0]}（期待: .${expected}）` })
  }
}

console.log(`\n🧭  SCSS 規約チェック  （基準: .cursor/rules/sass-block-file-variants.mdc）`)
console.log(`    対象 components/  /  違反 ${findings.length} 件\n`)

const label = { modifier: 'BEM modifier', multiblock: '複数ブロック同居', filename: 'ファイル名不一致' }
for (const f of findings) {
  const loc = f.n ? `${f.name}:${f.n}` : f.name
  console.log(`  ❌  [${label[f.kind]}]  ${loc}`)
  console.log(`        ${f.detail}`)
}

if (findings.length > 0) {
  console.log(`\n⚠️   バリアントは data-*、1 ブロック 1 ファイル（ファイル名＝ブロック名）へ。`)
  console.log('    詳細: .cursor/rules/sass-block-file-variants.mdc\n')
  process.exit(1)
} else {
  console.log('✅  規約違反なし\n')
}
