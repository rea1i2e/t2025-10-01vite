# t2025-10-01vite

Vite + EJS + Sass 構成の静的サイトテンプレートです。

この README は「入口ドキュメント」です。  
セットアップ・日常作業・主要導線のみを扱い、詳細仕様は `docs/architecture.md` に集約します。

## このREADMEの責務

- テンプレート固有の使い方（導入、日常コマンド、基本作業）
- どの情報をどのドキュメントで読むかの導線
- 汎用ナレッジへの参照（詳細は外部リポジトリ）

## 目次

- [クイックスタート](#クイックスタート)
- [日常作業コマンド](#日常作業コマンド)
- [よくある作業](#よくある作業)
- [ドキュメントの役割分担](#ドキュメントの役割分担)
- [外部ナレッジへの導線](#外部ナレッジへの導線)
- [プロンプト下書き](#プロンプト下書き)
- [ライセンス](#ライセンス)

## クイックスタート

### 必要要件

- Node.js 18.x 以上（推奨: 20.x LTS）
- npm 9.x 以上

### セットアップ

```bash
npm install
npm run dev
```

### GitHub CLI で新規作成する場合

```bash
gh repo create 新規リポジトリ名 \
  --template rea1i2e/t2025-10-01vite \
  --private \
  --description "リポジトリの説明文" && \
sleep 5 && \
gh repo clone GitHubのユーザー名/新規リポジトリ名
```

### 案件着手時（デモコードの削除）

テンプレートから複製したリポジトリで、デモ用コードを一括削除する。

```bash
npm run init
```

## 日常作業コマンド

- 開発サーバー

```bash
npm run dev
```

- 本番ビルド（`dist/` 出力 + 後処理）

```bash
npm run build
```

- ビルド確認

```bash
npm run preview
# または
npm run build:preview
```

- クリーンアップ

```bash
npm run clean
npm run clean:all
npm run reinstall
```

## よくある作業

### ページ追加

1. `config/site.config.js` の `ページのキーと値を設置`
2. `src/` 配下に `xxx/index.html` を作成
3. HTML 内で `ty_getPage('xxx')` を使い、「1.」で設定した情報を取得し,head.ejsなどに渡す

### 設定変更（よく触る項目）

- `config/site.config.js`
  - `pages`（ページ情報）
  - `imageAltFormats`（`none` / `webp` / `avif` / `both`）
  - `useFileHash`（`true`: ビルド後ファイル名にハッシュを付与 / `false`: ハッシュなし）
  - `minify`（`true`: CSS・JS を minify / `false`: minify しない）
- `vite.config.js`
  - ビルド出力先、画像最適化設定、`assetsInlineLimit` など

詳細仕様は [docs/architecture.md](docs/architecture.md) を参照してください。

## ドキュメントの役割分担

- `README.md`（このファイル）  
入口ガイド。導入・日常運用・参照導線を扱う。
- `docs/architecture.md`  
テンプレート固有仕様の正本。機能仕様・構成・処理フローを扱う。
- `AGENTS.md`  
AIエージェント作業ルール。更新対象ドキュメントの判断基準も扱う。

## 外部ナレッジへの導線

汎用ルール・分野別ナレッジは外部リポジトリ `2026-03-20kn` に集約します。  
このリポジトリでは詳細を重複記載せず、必要時に参照します。

- 公開リポジトリ: [rea1i2e/2026-03-20kn](https://github.com/rea1i2e/2026-03-20kn)

## プロンプト下書き

AIへの作業依頼プロンプト下書きは `prompts/` に置き、案件ごとに編集します。
雛形・更新の正本は外部ナレッジの `/Users/yoshiaki/working/2026-03-20kn/prompts` にあり、必要に応じてこのリポジトリへコピーして案件向けに編集します。

| ファイル                                                     | 用途                |
| -------------------------------------------------------- | ----------------- |
| [prompts/video-compress.md](./prompts/video-compress.md) | 動画圧縮をAIに依頼するプロンプト |


## ライセンス

プロジェクトに合わせて追記してください。