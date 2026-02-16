# AGENTS.md

本ファイルは、AIエージェントがこのプロジェクトで作業する際の指針を定義する。

## プロジェクト概要

Vite + EJS + Sass 構成の静的サイトテンプレート。  
詳細な技術仕様は [docs/architecture.md](docs/architecture.md) を参照。

## 重要ファイルと役割

| ファイル | 役割 |
|----------|------|
| `vite.config.js` | Vite設定（EJS注入、Sassグロブ、画像最適化、ビルド出力パス） |
| `config/site.config.js` | サイト名・ドメイン・ページ情報の一元管理 |
| `config/utils.js` | ユーティリティ関数（除外判定、email関数） |
| `scripts/after-build.mjs` | ビルド後HTML処理（picture化、width/height付与、整形） |
| `src/ejs/common/` | 共通テンプレート（head / header / footer） |
| `src/ejs/components/` | ページ固有の部品テンプレート |
| `src/assets/js/main.js` | JSエントリファイル |
| `src/assets/sass/style.scss` | Sassエントリファイル |
| `.github/workflows/deploy.yml` | CI/CD（FTPデプロイ + Discord通知） |

## コーディング規約

- **コミットメッセージ**: 日本語で記述する
- **EJS/HTMLのテキストコンテンツ**: 自動補完・自動生成しない。HTMLタグ内のテキストは人間が書く
- **データとHTMLの分離**: データ取得・定義とHTMLの記述は可能な限り分離する
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

## Git hooks に関する注意

- **pre-commit**: `npm run build:only` が実行される（ビルドが通らないとコミットできない）
- **pre-push**: `npm run validate:build` が実行される（ビルド + HTML検証が通らないとプッシュできない）

## ページ追加手順

1. `src/` 配下に `xxx/index.html` を作成
2. `config/site.config.js` の `pages` オブジェクトに同キーのページ情報を追加
3. HTML内で `pages['xxx']` からページ情報を取得し、EJSテンプレートを `include` して構成する

## EJSテンプレートの構成ルール

- `src/ejs/common/` — 全ページ共通のパーツ（`_head.ejs`, `_header.ejs`, `_footer.ejs`）
- `src/ejs/components/` — ページ固有の部品
- `src/ejs/data/` — ダミーデータ等
- テンプレートのインクルードには `ejsPath`（`config/site.config.js` で定義）を使用する
