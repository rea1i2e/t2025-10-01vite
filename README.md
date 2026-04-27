# t2025-10-01vite

**静的サイト制作用テンプレート**（略称 **静的テンプレ**）。GitHub テンプレート名は `t2025-10-01vite`。Vite + EJS + Sass 構成。  
3 リポジトリ間の呼称の正本はナレッジベースの [wiki/operated-repositories.md](/Users/yoshiaki/working/2026-04-23kn/wiki/operated-repositories.md#表記ルール3-リポジトリと型録) を参照。

この README は「入口ドキュメント」です。  
セットアップ・日常作業・主要導線のみを扱い、詳細仕様は `docs/architecture.md` に集約します。

## このREADMEの責務

- 静的テンプレ固有の使い方（導入、日常コマンド、基本作業）
- どの情報をどのドキュメントで読むかの導線
- ナレッジベースへの参照（汎用ルールの詳細は `wiki/`）

## 目次

- [クイックスタート](#クイックスタート)
- [日常作業コマンド](#日常作業コマンド)
- [よくある作業](#よくある作業)
- [ドキュメントの役割分担](#ドキュメントの役割分担)
- [ナレッジベースへの導線](#ナレッジベースへの導線)
- [アクセシビリティ仮基準](#アクセシビリティ仮基準)
- [動画圧縮を AI に依頼するとき](#動画圧縮を-ai-に依頼するとき)
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

### 導入時の注意事項（Git / husky）

この制作環境は **Git の利用を前提**としている。Git が無いと `npm install` が `prepare`（husky）で失敗し、**`node_modules` が不完全**になって `vite: command not found` のように見えることがある。**詳細・husky の目的・回避手順**はナレッジ [template-repository-docs.md](/Users/yoshiaki/working/2026-04-23kn/wiki/template-repository-docs.md)（Git・npm・husky）。

**概要（Git を使わない場合）**: [package.json](package.json) から `"prepare": "husky"` と `husky` の devDependency を削除してから `npm install` をやり直す。

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
  - `siteExternalLinks`（X・Instagram 等の絶対 URL。`npm run init` 後は空オブジェクト）
  - `shareIntentUrls`（X・Facebook・LINE の共有 URL）
  - `imageAltFormats`（`none` / `webp` / `avif` / `both`）
  - `useFileHash`（`true`: ビルド後ファイル名にハッシュを付与 / `false`: ハッシュなし）
  - `minify`（`true`: CSS を minify / `false`: CSS を minify しない（クライアント納品時など直接編集の可能性がある場合）。JS は常に minify）
- `vite.config.js`
  - ビルド出力先、画像最適化設定、`assetsInlineLimit` など

詳細仕様は [docs/architecture.md](docs/architecture.md) を参照してください。

## ドキュメントの役割分担

- `README.md`（このファイル）  
入口ガイド。導入・日常運用・参照導線を扱う。
- `docs/architecture.md`  
テンプレート固有仕様の正本。機能仕様・構成・処理フローを扱う。
- `docs/README.md`  
`docs/` 内への短い目次。
- `AGENTS.md`  
AI エージェント作業ルール。更新対象ファイルの指針。**「いつ doc を書くか」の汎用基準**はナレッジ [template-repository-docs.md](/Users/yoshiaki/working/2026-04-23kn/wiki/template-repository-docs.md)。

## ナレッジベースへの導線

汎用のコーディング規約・分野横断のメモは、**ナレッジベース** リポジトリー `2026-04-23kn` の `wiki/`（入口: `wiki/coding-conventions.md`。ローカル例: `/Users/yoshiaki/working/2026-04-23kn/wiki/coding-conventions.md`）に集約する。  
このリポジトリ（静的テンプレ）では詳細を重複記載せず、必要時に上記 `wiki` を参照する。旧 `2026-03-20kn` リポジトリは**廃止**とする。

## アクセシビリティ仮基準

- **正本（Must / Should・チェックリスト・改訂）**: ナレッジ [`wiki/a11y-baseline.md`](/Users/yoshiaki/working/2026-04-23kn/wiki/a11y-baseline.md)
- **本リポでの実装上の手がかり**（`ty_stripTags`・`_root.scss` のトークン・`<dialog>` 型録など）: [docs/architecture.md の 3.22 節](docs/architecture.md#322-アクセシビリティ仮基準)

## 動画圧縮を AI に依頼するとき

方針・コマンド・設定の正本は **`raw/videos/README-video-compress.md`**（`npm run inspect:video` → `compress-config.json` → `npm run compress:video`）。

- **Cursor Agent に任せる場合**の手順チェックリスト: ナレッジベースの **`/Users/yoshiaki/working/2026-04-23kn/.cursor/skills/video-compress-web/SKILL.md`**（ワークスペースにナレッジを含めるか、`~/.cursor/skills/` に同ファイルを置いてもよい）
- **チャットに文章で依頼する場合**は、上記 README を `@` で添付しつつ、対象動画のパス・用途（hero / loop 等）・表示サイズ・音声の要否を書けば足りる

索引: ナレッジ [`wiki/asset-compression-notes.md`](/Users/yoshiaki/working/2026-04-23kn/wiki/asset-compression-notes.md)

## ライセンス

プロジェクトに合わせて追記してください。