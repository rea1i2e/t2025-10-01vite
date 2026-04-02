# minify 方針変更メモ

## 変更概要

`siteConfig.minify` の制御対象を **CSS のみ** に変更した。JS は常に minify される。

## 変更前

| 対象 | 動作 |
|------|------|
| JS   | `siteConfig.minify` に従う |
| CSS  | `siteConfig.minify` に従う |

`vite.config.js`:
```js
build: {
  minify,  // JS・CSS 両方に適用
}
```

## 変更後

| 対象 | 動作 |
|------|------|
| JS   | 常に minify（固定） |
| CSS  | `siteConfig.minify` に従う |

`vite.config.js`:
```js
build: {
  minify: true,       // JS は常に minify
  cssMinify: minify,  // CSS のみ site.config.js の設定に従う
}
```

## 変更理由

`siteConfig.minify: false` にする目的は「クライアント納品時など、ビルド済みファイルを直接編集する可能性がある場合に備えること」である。

この目的に照らすと、JS を minify しないことに実質的な意味はない。

- **CSS**: minify しなければセレクタ・プロパティがそのまま残り、直接編集できる
- **JS**: Vite（Rollup）によってバンドル済みのため、minify の有無に関わらず複数ファイルが結合・モジュール構造が失われており、直接編集は困難

したがって JS は常に minify し、`siteConfig.minify` は CSS のみに効かせる構成に変更した。

## 変更ファイル

| ファイル | 変更内容 |
|----------|----------|
| `vite.config.js` | `minify: true` 固定 + `cssMinify: minify` 追加 |
| `config/site.config.js` | `minify` オプションのコメントを CSS のみに更新 |
| `docs/architecture.md` | 拡張・変更ガイドの `minify` 説明を更新 |
| `README.md` | サイト設定の `minify` 説明を更新 |
