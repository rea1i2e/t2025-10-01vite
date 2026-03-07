# AGENTS.md

本ファイルは、AIエージェントがこのプロジェクトで作業する際の指針を定義する。

## プロジェクト概要

Vite + EJS + Sass 構成の静的サイトテンプレート。  
詳細な技術仕様は [docs/architecture.md](docs/architecture.md) を参照。

## 重要ファイルと役割

| ファイル | 役割 |
|----------|------|
| `vite.config.js` | Vite設定（EJS注入、Sassグロブ、画像最適化、ビルド出力パス）。アセットのインライン化を無効にする場合は `assetsInlineLimit` のコメントを参照 |
| `config/site.config.js` | サイト名・ドメイン・ページ情報の一元管理・getPage() |
| `config/utils.js` | ユーティリティ関数（除外判定、email関数） |
| `scripts/after-build.mjs` | ビルド後HTML処理（picture化、width/height付与、整形） |
| `scripts/setup-secrets.sh` | GitHub Actions 用シークレットを `.env.deploy` から `gh` で一括登録 |
| `scripts/font-compress.sh` | フォントを全グリフのまま WOFF2 に圧縮（pyftsubset） |
| `scripts/font-compress-subset.sh` | フォントを指定文字のみサブセット化して WOFF2 に圧縮 |
| `scripts/README-font-compress.md` | フォント圧縮ツールの前提条件・使い方 |
| `env.deploy.example` | デプロイ用環境変数テンプレート（`.env.deploy` の雛形） |
| `src/ejs/common/` | 共通テンプレート（head / header / footer） |
| `src/ejs/components/` | ページ固有の部品テンプレート |
| `src/assets/js/main.js` | JSエントリファイル |
| `src/assets/js/_parallax.js` | 汎用パララックス（data-parallax でトリガー・移動量を指定） |
| `src/assets/sass/style.scss` | Sassエントリファイル |
| `.github/workflows/deploy.yml` | CI/CD（FTPデプロイ + Discord通知） |

## ドキュメント更新ルール

機能の追加・変更を行った場合、以下のドキュメントを必ず更新すること。

### docs/architecture.md
- セクション3「機能仕様」に新しいサブセクション（3.x）として追記する
- 記載すべき内容: 関連ファイル、動作仕様、使用方法
- 既存機能の変更の場合は、該当セクションを更新する

### AGENTS.md
- 重要ファイルが増えた場合 →「重要ファイルと役割」テーブルに追加
- 新しいコーディング規約が必要な場合 →「コーディング規約」に追加
- ビルドフローが変わった場合 →「ビルドフロー」を更新

### README.md
- npm scripts が増えた場合 →「スクリプト」セクションに追加
- site.config.js のオプションが増えた場合 →「サイト設定」セクションに追加



## コーディング規約

- **コミットメッセージ**: 日本語で記述する
- **EJS/HTMLのテキストコンテンツ**: 自動補完・自動生成しない。HTMLタグ内のテキストは人間が書く
- **データとHTMLの分離**: データ取得・定義とHTMLの記述は可能な限り分離する
- **EJS の属性値出力**: `alt`・`title` など HTML 属性にデータを出すときは、タグを除去しつつエスケープする。`<%= (value || '').replace(/<[^>]*>/g, '') %>` を使い、`<%- value %>` は使わない。表示用の要素（例: 見出しの `<h2>` 内で改行タグを活かす）では `<%- %>` のまま可。
- **Sass構成**: `base/` / `components/` / `layouts/` / `utility/` のディレクトリ構成に従う
- **JSモジュール**: 機能単位で `_xxx.js` としてファイルを分割し、`main.js` で `import` する

## ビルドフロー

```
npm run build
  1. vite build          … HTML/CSS/JS/画像のビルド + 画像圧縮・WebP生成
  2. after-build.mjs     … dist/ 内HTMLに width/height 付与、picture化、整形
```

- ビルド成果物は `dist/` に出力される
- 画像圧縮・WebP生成はビルド時に自動実行されるため、手動変換は不要
- CSS 内で参照した 4KB 未満のアセット（SVG 等）はデフォルトで data URI としてインライン化される。別ファイルで出力したい場合は `vite.config.js` の `assetsInlineLimit` のコメントを参照

## Git hooks に関する注意

- **pre-commit**: `npm run build:only` が実行される（ビルドが通らないとコミットできない）
- **pre-push**: `npm run validate:build` が実行される（ビルド + HTML検証が通らないとプッシュできない）

## ページ追加手順

1. `src/` 配下に `xxx/index.html` を作成
2. `config/site.config.js` の `pages` オブジェクトに同キーのページ情報を追加
3. HTML内で `const page = getPage('xxx');` でページ情報を取得し、EJSテンプレートを `include` して構成する

## EJSテンプレートの構成ルール

- `src/ejs/common/` — 全ページ共通のパーツ（`_head.ejs`, `_header.ejs`, `_footer.ejs`）
- `src/ejs/components/` — ページ固有の部品
- `src/ejs/data/` — ダミーデータ等
- テンプレートのインクルードには `ejsPath`（`config/site.config.js` で定義）を使用する

