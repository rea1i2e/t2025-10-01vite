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
- [ナレッジベース（第二の脳）への導線](#ナレッジベース第二の脳への導線)
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

### 導入時の注意事項

この制作環境は **Git の利用を前提**としている。

Git を使わない場合（ZIP のみ展開するなど、`.git` がない場合）、`npm install` の最後に `prepare` で husky が動き、**Git 前提の処理が失敗して `npm install` 全体が完了しない**ことがある。その結果、`vite: command not found` のように見えることがある。原因は「Vite が PATH にない」だけでなく、**`npm install` が途中で止まり `node_modules` が不完全**になっていることが多い（`husky` の失敗 → install 不完全 → `vite` が存在しない、という連鎖）。

**husky** は Git の hooks を設定する仕組みで、本リポジトリ（静的テンプレ）では **`pre-commit` で `npm run validate:build`**（`npm run build` → `validate:html`）が走る。`build` には **`vite build` のあと `scripts/after-build.mjs`** が含まれる。コミット時点で本番相当の `dist/` と HTML 検証が通っていることを前提にし、**プッシュ前に FTP で手動アップロードした場合でも、`after-build.mjs` 未実行の `dist/` をコミットしてしまうリスク**を抑える。プッシュ時に同じ検証は繰り返さない（`pre-commit` で十分なため）。

#### Git を使わない場合の回避

[package.json](package.json) から次を削除する。

- `scripts` の `"prepare": "husky"`
- `devDependencies` の `"husky": "^9.1.7",`

削除後に `npm install` をやり直す。

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
- `docs/a11y-baseline.md`  
アクセシビリティ仮基準の**案内（stub）**。**正本**はナレッジベースの `wiki/a11y-baseline.md`。ここには EJS・型録など**静的テンプレ固有**の補足のみ。
- `AGENTS.md`  
AIエージェント作業ルール。更新対象ドキュメントの判断基準も扱う。

## ナレッジベース（第二の脳）への導線

汎用のコーディング規約・分野横断のメモは、**ナレッジベース**（別名 **第二の脳**）リポジトリー `2026-04-23kn` の `wiki/`（入口: `wiki/coding-conventions.md`。ローカル例: `/Users/yoshiaki/working/2026-04-23kn/wiki/coding-conventions.md`）に集約する。  
このリポジトリ（静的テンプレ）では詳細を重複記載せず、必要時に上記 `wiki` を参照する。旧 `2026-03-20kn` リポジトリは**廃止**とする。

## プロンプト下書き

AI への作業依頼プロンプト下書きは **このリポジトリの** `prompts/` に置き、案件ごとに編集する。雛形の更新方針は `AGENTS.md` に従う。

| ファイル                                                     | 用途                |
| -------------------------------------------------------- | ----------------- |
| [prompts/video-compress.md](./prompts/video-compress.md) | 動画圧縮をAIに依頼するプロンプト |


## ライセンス

プロジェクトに合わせて追記してください。