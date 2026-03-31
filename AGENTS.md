# AGENTS.md

本ファイルは、AIエージェントがこのプロジェクトで作業する際の指針を定義する。

## プロジェクト概要

Vite + EJS + Sass 構成の静的サイトテンプレート。  
詳細な技術仕様は [docs/architecture.md](docs/architecture.md) を参照。

## ドキュメントの責務境界

- このリポジトリ: テンプレート固有の使い方・設定・仕様を管理する
- 外部ナレッジ（`/Users/yoshiaki/working/2026-03-20kn/README.md`）: 汎用コーディング原則・分野横断ナレッジを管理する
- 同一内容を複数箇所に重複記載しない。必要な場合は要約1行 + 参照リンクで扱う

### 外部移管候補（汎用化できる内容）
- 動画圧縮の用途分類・品質判断の一般論
- フォント圧縮の一般論（サブセット設計、文字集合の決め方）
- デプロイや運用のテンプレート非依存な判断基準

## 重要ファイルと役割

| ファイル | 役割 |
|----------|------|
| `vite.config.js` | Vite設定（EJS注入、Sassグロブ、画像最適化、ビルド出力パス）。アセットのインライン化を無効にする場合は `assetsInlineLimit` のコメントを参照 |
| `config/site.config.js` | サイト名・ドメイン・ページ情報の一元管理・getPage()。画像代替フォーマット（`imageAltFormats`）もここで指定 |
| `config/utils.js` | ユーティリティ関数（除外判定、email関数、ty_stripTags） |
| `scripts/after-build.mjs` | ビルド後HTML処理（picture化、width/height付与、CSS image-set、整形）。config/site.config.js の imageAltFormats を参照 |
| `scripts/setup-secrets.sh` | GitHub Actions 用シークレットを `.env.deploy` から `gh` で一括登録 |
| `raw/videos/inspect-videos.mjs` | 動画情報サマリー出力（AI依頼時に使用） |
| `raw/videos/compress-video.mjs` | 動画まとめ圧縮＋レポート生成 |
| `scripts/font-compress.sh` | フォントを全グリフのまま WOFF2 に圧縮（pyftsubset） |
| `scripts/font-compress-subset.sh` | フォントを指定文字のみサブセット化して WOFF2 に圧縮 |
| `scripts/README-font-compress.md` | フォント圧縮ツールの前提条件・使い方 |
| `env.deploy.example` | デプロイ用環境変数テンプレート（`.env.deploy` の雛形） |
| `src/ejs/components/` | 毎回使う部品テンプレート |
| `src/ejs/demo-components/` | よく使うの部品テンプレート |
| `src/assets/js/main.js` | JSエントリファイル |
| `src/assets/js/_demo-fv-video.js` | デモ用。ファーストビュー動画の PC/SP src 切替・ミュート／音声オン別ボタン（`demo/demo-fv-video/`） |
| `src/assets/js/demo/_demo-api.js` | デモ用。JSONPlaceholder users の `fetch` と `li` による名前一覧（`demo/demo-api/`） |
| `src/assets/js/demo/_demo-sound.js` | デモ用。読み込み時 `<dialog>` で音声 ON/OFF を選び、ON 時のみ再生（`demo/demo-sound/`） |
| `src/assets/js/_parallax.js` | 汎用パララックス（data-parallax でトリガー・移動量を指定） |
| `src/assets/sass/style.scss` | Sassエントリファイル |
| `src/assets/sass/base/_root.scss` | フォント・CSS変数（`:root`）。ライト/ダーク用の `--color-bg` / `--color-text` 等と `@media (prefers-color-scheme: dark)` による上書き |
| `src/assets/js/_theme-toggle.js` | **Demo用**。ライト/ダーク切り替えボタンのクリック処理。案件時は本ファイル削除と main.js の import 削除が必要 |
| `.github/workflows/deploy.yml` | CI/CD（FTPデプロイ + Discord通知） |

## ドキュメント更新ルール

機能の追加・変更を行った場合、以下のドキュメントを必ず更新すること。

### docs/architecture.md
- セクション3「機能仕様」に新しいサブセクション（3.x）として追記する
- 記載すべき内容: 関連ファイル、動作仕様、使用方法
- 既存機能の変更の場合は、該当セクションを更新する

### AGENTS.md
- 重要ファイルが増えた場合 →「重要ファイルと役割」テーブルに追加
- テンプレート固有の実装ルールを追加・変更した場合 →「コーディング規約」に追記・更新
- ビルドフローが変わった場合 →「ビルドフロー」を更新

### README.md
- npm scripts が増えた場合 →「スクリプト」セクションに追加
- site.config.js のオプションが増えた場合 →「サイト設定」セクションに追加

### 重複回避ルール
- テンプレート固有の仕様変更は `docs/architecture.md` を正本として更新し、`README.md` は導線のみ調整する
- 汎用ルールの追記は外部ナレッジ側を更新し、このリポジトリでは参照リンクを更新する



## プロンプト下書き

AIへの作業依頼プロンプトの下書きは `prompts/` に置く。
ナレッジリポジトリの `prompts/` にあるテンプレートをもとに、案件ごとの情報を記入して使う。

| ファイル | 用途 |
|---|---|
| [`prompts/video-compress.md`](prompts/video-compress.md) | 動画圧縮をAIに依頼するプロンプト |

---

## コーディング規約

コーディング全般のルール・作業手順・判断基準は、ナレッジリポジトリ `/Users/yoshiaki/working/2026-03-20kn/AGENTS.md` を正本として参照すること。
このリポジトリには、テンプレート固有の実装ルールのみを記載する。
実装中に迷ったときは、ナレッジ側 AGENTS の「実装時の参照先」から該当ファイルを `@` で指定して質問する。

### このリポジトリ固有の実装ルール

- **EJS の属性値出力**: `alt`・`title`・`aria-label` など HTML 属性にデータを出すときは、`config/utils.js` の `ty_stripTags` 関数を使ってタグを除去しつつエスケープする。`<%= ty_stripTags(value) %>` を使い、`<%- value %>` は使わない。表示用の要素（例: 見出しの `<h2>` 内で改行タグを活かす）では `<%- %>` のまま可。
- **EJS内で使う自作関数の命名**: EJS から呼ぶ自作ヘルパーは `ty_` プレフィックスで統一する（標準 API や外部ライブラリのメソッドと区別しやすくするため）
- **Sass構成**: `base/` / `components/` / `layouts/` / `utility/` のディレクトリ構成に従う
- **JSモジュール**: 機能単位で `_xxx.js` としてファイルを分割し、`main.js` で `import` する

### デモページ・コンポーネント追加時のカラー指定

デモページやデモ用コンポーネントを追加するときは、背景色・文字色・枠線に**共通のカスタムプロパティ**（`src/assets/sass/base/_root.scss` の `:root` で定義）を使う。ライト/ダークモードは `prefers-color-scheme` で切り替わるため、直書きの色指定を避ける。

| 用途 | 変数名 | 使用例 |
|------|--------|--------|
| ページ背景 | `--color-bg` | `body`、メインコンテンツ背景 |
| 本文・見出しの文字色 | `--color-text` | 通常のテキスト |
| カード・パネル・ナビ・テーブル斑など「面」の背景 | `--color-bg-sub` | カード、アコーディオン、モーダル、テーブル th/偶数行 |
| インラインコード・コードブロック背景 | `--color-bg-code` | `code` 要素の背景 |
| 枠線 | `--border` | `border: var(--border)` |
| 通常の影 | `--shadow` | `box-shadow: var(--shadow)` |
| ホバー・浮き上がり用の影 | `--shadow-hover` | ホバー時に `box-shadow: var(--shadow-hover)` |
| 影なし | `--shadow-none` | フォーム等のリセット用 |
| 内側の影 | `--shadow-inset` | オーバーレイ等 |

新規パーツで「面」を持つ場合は `background-color: var(--color-bg-sub); color: var(--color-text);`、枠線は `border: var(--border);` を指定する。これにより追加対応なしでライト/ダークに連動する。

## ビルドフロー

```
npm run build
  1. vite build          … HTML/CSS/JS/画像のビルド + 画像圧縮・WebP/AVIF生成（config/site.config.js の imageAltFormats で制御）
  2. after-build.mjs     … dist/ 内HTMLに width/height 付与、picture化、CSS image-set、整形
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
3. HTML内で `const page = ty_getPage('xxx');` でページ情報を取得し、EJSテンプレートを `include` して構成する

## EJSテンプレートの構成ルール

- `src/ejs/common/` — 全ページ共通のパーツ（`_head.ejs`, `_header.ejs`, `_footer.ejs`）
- `src/ejs/components/` — ページ固有の部品
- `src/ejs/data/` — ダミーデータ等
- テンプレートのインクルードには `ejsPath`（`config/site.config.js` で定義）を使用する

## デモ削除時の手順（案件リポジトリ作成時）

demo ページ・コンポーネントを削除する際、**ライト/ダークモード（Demo用）** を外す場合は以下を実施する。

1. `src/ejs/common/_footer.ejs` から `components-demo/_theme-toggle.ejs` の include 行を削除
2. `src/ejs/components-demo/_theme-toggle.ejs` を削除（または components-demo ごと削除）
3. `src/assets/js/_theme-toggle.js` を削除し、`main.js` の `import './_theme-toggle.js';` を削除
4. `src/assets/sass/demo-components/` を丸ごと削除する場合は `_c-theme-toggle.scss` も一緒に削除される
5. ライト/ダーク機能自体が不要な場合は、`_head.ejs` の theme 用インラインスクリプトと `_root.scss` の `html[data-theme]` / `:root:not([data-theme])` まわりを削除する

