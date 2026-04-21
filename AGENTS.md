# AGENTS.md

本ファイルは、AIエージェントがこのプロジェクトで作業する際の指針を定義する。

## プロジェクト概要

Vite + EJS + Sass 構成の静的サイトテンプレート。  
詳細な技術仕様は [docs/architecture.md](docs/architecture.md) を参照。

## ローカル絶対パス（個人環境・Cursor 用）

複製テンプレ運用で、エージェントが `@` 参照やファイル読み込みに使う。共有マシン・リモートではパスが一致しない。

| 役割 | パス |
|------|------|
| 本リポジトリ（この静的 Vite テンプレ） | `/Users/yoshiaki/working/✈️制作テンプレート/t2025-10-01vite` |
| 対になる WordPress テーマ（Local・対応案件の一例。実パスは各案件テーマの AGENTS を正とする） | `/Users/yoshiaki/Local Sites/t2025-12-24vite-wp/app/public/wp-content/themes/t2025-12-24vite-wp` |
| ナレッジ用リポジトリ（コーディングルール・`stock/`） | `/Users/yoshiaki/working/2026-03-20kn` |

### 案件ナレッジ（stock）

- **実装・コミット**はこのリポジトリ（本テンプレ）で行う。
- **案件ナレッジの md** はナレッジ用リポの `stock/` にだけ追加・更新する。書式は [`/Users/yoshiaki/working/2026-03-20kn/formats/stock-format.md`](/Users/yoshiaki/working/2026-03-20kn/formats/stock-format.md) に従う。**このテンプレ内に `stock/` や案件メモ専用の md を新設しない**。
- Cursor では、必要に応じてナレッジ用リポをマルチルートで開くか、チャットにそのリポの `AGENTS.md` または `formats/stock-format.md` を添付する。

## インタラクション部品の型録（エージェント向け）

案件リポジトリ（WordPress テーマ等）で **タブ・スライダー・モーダル** などの実装依頼が短く述べられただけのとき、エージェントは **本リポジトリを型録として読んでから** 相手先のスタックへ移植すること。案件側の `AGENTS.md` には本リポジトリの絶対パスと「型録参照（必須）」手順を書く（個人環境。複製後は案件の AGENTS を正とする）。

**本リポジトリ内の相対パス対応（実装前に JS + EJS + Sass を揃えて読む）**

| 機能 | JS | EJS | Sass | デモページ（どのパーツを載せているかの索引） |
|------|----|-----|------|---------------------------------------------|
| タブ切り替え | `src/assets/js/demo/_tab.js` | `src/ejs/components-demo/_p-tab.ejs` | `src/assets/sass/demo-components/_p-tab.scss` | `src/demo/demo-tab/index.html` |
| アコーディオン | `src/assets/js/demo/_accordion.js` | `src/ejs/components-demo/_p-accordions.ejs` | `src/assets/sass/demo-components/_p-accordions.scss` | `src/demo/demo-accordion/index.html` |
| モーダル（dialog） | `_dialog-general.js`、`_dialog-youtube.js`、`_dialog-video.js`（`src/assets/js/demo/`、共通 `_dialog-common.js`） | `src/ejs/components-demo/_p-dialog*.ejs` | `src/assets/sass/demo-components/_p-dialog*.scss` | `src/demo/demo-dialog/index.html` |
| モーダル（dialog 非使用） | `src/assets/js/demo/_modal.js` | 用途に応じて `components-demo` を検索 | 上記 `demo-components` を検索 | `demo-dialog` を参考 |
| Splide スライダー | `src/assets/js/demo/_splide-fade.js` 等（`_splide-loop`、`_splide-thumbnail`、`_splide-progress`、`_splide-posts`） | 同名 `_p-splide-*.ejs` | 同名 `_p-splide-*.scss` | `src/demo/demo-splide/index.html` |

デモページ新規作成時に既存の `components-demo`／`demo-components`／シェル構造を再利用するための索引は `src/demo/demo-toolkit/index.html` を参照する。

その他は `src/assets/js/main.js` の `./demo/` import と、`config/site.config.js` の `demo*` ページ定義・`src/demo/` 以下のフォルダを手がかりにする。

## 重要ファイルと役割

| ファイル | 役割 |
|----------|------|
| `vite.config.js` | Vite設定（EJS注入、Sassグロブ、画像最適化、ビルド出力パス）。アセットのインライン化を無効にする場合は `assetsInlineLimit` のコメントを参照 |
| `config/site.config.js` | サイト名・ドメイン・ページ情報の一元管理・getPage()。画像代替フォーマット（`imageAltFormats`）もここで指定 |
| `config/utils.js` | ユーティリティ関数（除外判定、email関数、ty_stripTags） |
| `scripts/after-build.mjs` | ビルド後HTML処理（picture化、width/height付与、CSS image-set、整形）。config/site.config.js の imageAltFormats を参照 |
| `scripts/init-project.sh` | 案件着手時にデモ用コードを一括削除するスクリプト（`npm run init` で実行） |
| `scripts/setup-secrets.sh` | GitHub Actions 用シークレットを `.env.deploy` から `gh` で一括登録 |
| `raw/videos/inspect-videos.mjs` | 動画情報サマリー出力（AI依頼時に使用） |
| `raw/videos/compress-video.mjs` | 動画まとめ圧縮＋レポート生成 |
| `scripts/font-compress.sh` | フォントを全グリフのまま WOFF2 に圧縮（pyftsubset） |
| `scripts/font-compress-subset.sh` | フォントを指定文字のみサブセット化して WOFF2 に圧縮 |
| `scripts/README-font-compress.md` | フォント圧縮ツールの前提条件・使い方 |
| `env.deploy.example` | デプロイ用環境変数テンプレート（`.env.deploy` の雛形） |
| `src/ejs/components/` | 毎回使う部品テンプレート |
| `src/ejs/demo-components/` | よく使うの部品テンプレート |
| `src/demo/demo-toolkit/index.html` | デモ製作用。既存 EJS・Sass・シェルを組み合わせるための索引ページ |
| `src/assets/js/main.js` | JSエントリファイル |
| `src/assets/js/_demo-fv-video.js` | デモ用。ファーストビュー動画の PC/SP src 切替・ミュート／音声オン別ボタン（`demo/demo-fv-video/`） |
| `src/assets/js/demo/_demo-api.js` | デモ用。JSONPlaceholder users の `fetch` と `li` による名前一覧（`demo/demo-api/`） |
| `src/assets/js/demo/_demo-sound.js` | デモ用。読み込み時 `<dialog>` で音声 ON/OFF を選び、ON 時のみ再生（`demo/demo-sound/`） |
| `src/assets/js/demo/_demo-random-page-nav.js` | デモ用。`sessionStorage` で表示済みスラッグを避けつつトップ／下層間をランダム遷移（`demo/demo-random-page-nav/`） |
| `src/ejs/components-demo/_p-random-page-nav.ejs` | デモ用。ランダムページ遷移（訪問済み除外）デモの共通マークアップ（ボタン・`data-*`） |
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

---

## コーディング規約

コーディング全般のルール・作業手順・判断基準は、ナレッジリポジトリ `/Users/yoshiaki/working/2026-03-20kn/AGENTS.md` を正本として参照すること。
このリポジトリには、テンプレート固有の実装ルールのみを記載する。
実装中に迷ったときは、ナレッジ側 AGENTS の「実装時の参照先」から該当ファイルを `@` で指定して質問する。

## ファイル操作（Git）

- **ファイル名変更・移動は `git mv` を使う** — `mv` で直接変えると履歴が引き継がれない場合がある。
- **大文字小文字の変更は一度別名を経由する** — macOS は大文字小文字を区別しないため、直接変更するとGitに検知されないことがある。`git mv old.md tmp.md && git mv tmp.md New.md` のように対応する。
- **参照箇所を合わせて更新する** — リネーム後は import パス・EJSのincludeパス・`AGENTS.md` の一覧を確認して修正する。
- **リネームはコミットを分ける** — 内容変更と同時にリネームすると差分が追いにくくなる。リネームのみのコミットを先に作る。

---

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

- **pre-commit**: `npm run validate:build`（`build` → `validate:html`）。`build` は `vite build` のあと `scripts/after-build.mjs` を含む。FTP 手動アップロードがプッシュより先に走る運用でも、コミット時点で本番相当の `dist/` と HTML 検証が通っていることを前提にする。`pre-push` では同じ検証は行わない（コミット時に担保済みのため）。

## ページ追加手順

1. `src/` 配下に `xxx/index.html` を作成
2. `config/site.config.js` の `pages` オブジェクトに同キーのページ情報を追加
3. HTML内で `const page = ty_getPage('xxx');` でページ情報を取得し、EJSテンプレートを `include` して構成する

## EJSテンプレートの構成ルール

- `src/ejs/common/` — 全ページ共通のパーツ（`_head.ejs`, `_header.ejs`, `_footer.ejs`）
- `src/ejs/components/` — ページ固有の部品
- `src/ejs/data/` — ダミーデータ等
- テンプレートのインクルードには `ejsPath`（`config/site.config.js` で定義）を使用する

## デモ削除手順（案件リポジトリ作成時）

テンプレートから複製した案件リポジトリで、以下のコマンドを実行する。

```bash
npm run init
```

以下が一括で削除・更新される。

**削除されるディレクトリ**
- `src/demo/` — デモページ群
- `src/ejs/components-demo/` — デモ用EJSパーツ
- `src/assets/js/demo/` — デモ用JSファイル
- `src/assets/sass/demo-components/` — デモ用Sassファイル
- `src/assets/images/demo/` — デモ用画像
- `src/assets/images/common/` — テンプレ共通画像置き場の掃除（案件で差し替え前提）
- `src/assets/videos/demo/` — デモ用動画
- `src/assets/audio/demo-sound/` — デモ用音声
- `raw/videos/demo/` — デモ用動画素材

**削除されるファイル**
- `src/ejs/data/posts.js` — デモ用ダミーデータ
- `src/public/` 配下の**すべてのファイル**（`MailForm01_utf8/` などサブフォルダは空のまま残る）

**更新されるファイル**
- `src/assets/js/main.js` — `./demo/` への import 行を削除。`// import './_debugScrollable.js';` は残す
- `src/assets/sass/style.scss` — `@use "./demo-components/**"` 行を削除
- `src/ejs/common/_footer.ejs` — `_theme-toggle.ejs` の include 行を削除
- `config/site.config.js` — デモページ定義（`demo` / `demoXxx` / `demoVariants` / `demoJavaScript` / `contact` / `thanks` / `privacy` / `x` キー）を削除

**実行後の追加対応**
- `config/site.config.js` の `siteName` / `baseUrl` を案件情報に更新する
- ライト/ダーク機能自体が不要な場合は、`_head.ejs` の theme 用インラインスクリプトと `_root.scss` の `html[data-theme]` / `:root:not([data-theme])` まわりを削除する

