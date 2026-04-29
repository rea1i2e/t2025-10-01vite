# AGENTS.md

本ファイルは、AIエージェントがこのプロジェクトで作業する際の指針を定義する。

## プロジェクト概要

**静的サイト制作用テンプレート**（略称 **静的テンプレ**）。Vite + EJS + Sass 構成。  
呼称の正本はナレッジベースの [wiki/operated-repositories.md](/Users/yoshiaki/working/2026-04-23kn/wiki/operated-repositories.md#表記ルール3-リポジトリと型録)（表記ルール）。  
詳細な技術仕様は [docs/architecture.md](docs/architecture.md) を参照。

## ローカル絶対パス（個人環境・Cursor 用）

複製テンプレ運用で、エージェントが `@` 参照やファイル読み込みに使う。共有マシン・リモートではパスが一致しない。

| 役割 | パス |
|------|------|
| 静的テンプレ（本リポジトリ） | `/Users/yoshiaki/working/t2025-10-01vite` |
| WP テンプレ（Local・対応案件の一例。実パスは各案件テーマの AGENTS を正とする） | `/Users/yoshiaki/Local Sites/t2025-12-24vite-wp/app/public/wp-content/themes/t2025-12-24vite-wp` |
| ナレッジベース（コーディング規約の汎用正本・`wiki`） | `/Users/yoshiaki/working/2026-04-23kn` |

### 案件ナレッジ（stock）

- **実装・コミット**はこのリポジトリ（静的テンプレ）で行う。
- **案件ナレッジの md** の置き方・書式の目安は、ナレッジベースの [`/Users/yoshiaki/working/2026-04-23kn/wiki/stock-format.md`](/Users/yoshiaki/working/2026-04-23kn/wiki/stock-format.md) に従う（`wiki` 上に案件用ページを切る、または `raw/`・案件リポ等）。**このリポジトリ内に `stock/` や案件メモ専用の md を新設しない**。
- Cursor では、必要に応じてナレッジベースをマルチルートで開くか、チャットにその `AGENTS.md` または `wiki/stock-format.md` を添付する。

## インタラクション部品の型録（エージェント向け）

**型録**はリポジトリ名ではなく、**静的テンプレ（本リポ）** が WP 案件などでインタラクション実装の参照元として果たす役割を指す（定義はナレッジ [operated-repositories.md](/Users/yoshiaki/working/2026-04-23kn/wiki/operated-repositories.md)）。

案件リポジトリ（WP テーマ等）で **タブ・スライダー・モーダル** などの実装依頼が短く述べられただけのとき、エージェントは **型録として静的テンプレ（本リポ）を読んでから** 相手先のスタックへ移植すること。案件側の `AGENTS.md` には静的テンプレのルート絶対パスと「型録参照（必須）」手順を書く（個人環境。複製後は案件の AGENTS を正とする）。

**静的テンプレ内の相対パス対応（実装前に JS + EJS + Sass を揃えて読む）**

| 機能 | JS | EJS | Sass | デモページ（どのパーツを載せているかの索引） |
|------|----|-----|------|---------------------------------------------|
| タブ切り替え | `src/assets/js/demo/_tab.js` | `src/ejs/components-demo/_p-tab.ejs` | `src/assets/sass/demo-components/_p-tab.scss` | `src/demo/demo-tab/index.html` |
| アコーディオン | `src/assets/js/demo/_accordion.js` | `src/ejs/components-demo/_p-accordions.ejs` | `src/assets/sass/demo-components/_p-accordions.scss` | `src/demo/demo-accordion/index.html` |
| モーダル（dialog） | `_dialog-general.js`、`_dialog-youtube.js`、`_dialog-video.js`（`src/assets/js/demo/`、共通 `_dialog-common.js`） | `src/ejs/components-demo/_p-dialog*.ejs` | `src/assets/sass/demo-components/_p-dialog*.scss` | `src/demo/demo-dialog/index.html` |
| モーダル（dialog 非使用） | `src/assets/js/demo/_modal.js` | 用途に応じて `components-demo` を検索 | 上記 `demo-components` を検索 | `demo-dialog` を参考 |
| SNS 共有（ty_appendQuery ／ 表示中 URL） | `src/assets/js/demo/_demo-share.js` | `src/ejs/components-demo/_p-demo-share.ejs` | `src/assets/sass/demo-components/_p-demo.scss`（`.p-demo__list` 等） | `src/demo/demo-share/index.html` |
| Splide スライダー | `src/assets/js/demo/_splide-fade.js` 等（`_splide-loop`、`_splide-thumbnail`、`_splide-progress`、`_splide-posts`） | 同名 `_p-splide-*.ejs` | 同名 `_p-splide-*.scss` | `src/demo/demo-splide/index.html` |

デモページ新規作成時に既存の `components-demo`／`demo-components`／シェル構造を再利用するための索引は `src/demo/demo-toolkit/index.html` を参照する。

その他は `src/assets/js/main.js` の `./demo/` import と、`config/site.config.js` の `demo*` ページ定義・`src/demo/` 以下のフォルダを手がかりにする。

## 重要ファイルと役割

| ファイル | 役割 |
|----------|------|
| `vite.config.js` | Vite設定（EJS注入、Sassグロブ、画像最適化、ビルド出力パス）。アセットのインライン化を無効にする場合は `assetsInlineLimit` のコメントを参照 |
| `eslint.config.js` | ESLint フラット設定（`.js` / `.mjs` のみ。`npm run lint`） |
| `config/site.config.js` | サイト名・ドメイン・ページ情報の一元管理・getPage()。画像代替フォーマット（`imageAltFormats`）もここで指定 |
| `config/utils.js` | ユーティリティ関数（除外判定、email関数、ty_stripTags、ty_appendQuery） |
| `scripts/after-build.mjs` | ビルド後HTML処理（picture化、width/height付与、CSS image-set、整形）。config/site.config.js の imageAltFormats を参照 |
| `scripts/init-project.sh` | 案件着手時にデモ用コードを一括削除するスクリプト（`npm run init` で実行） |
| `scripts/setup-secrets.sh` | GitHub Actions 用シークレットを `.env.deploy` から `gh` で一括登録 |
| `raw/videos/inspect-videos.mjs` | 動画情報サマリー出力（AI依頼時に使用） |
| `raw/videos/compress-video.mjs` | 動画まとめ圧縮＋レポート生成 |
| `raw/fonts/font-compress.sh` | フォントを全グリフのまま WOFF2 に圧縮（pyftsubset） |
| `raw/fonts/font-compress-subset.sh` | フォントを指定文字のみサブセット化して WOFF2 に圧縮 |
| `raw/fonts/README-font-compress.md` | フォント圧縮ツールの前提条件・使い方 |
| `env.deploy.example` | デプロイ用環境変数テンプレート（`.env.deploy` の雛形） |
| `src/ejs/components/` | 毎回使う部品テンプレート |
| `src/ejs/demo-components/` | よく使うの部品テンプレート |
| `src/demo/demo-toolkit/index.html` | デモ製作用。既存 EJS・Sass・シェルを組み合わせるための索引ページ |
| `src/assets/js/main.js` | JSエントリファイル |
| `src/assets/js/_demo-fv-video.js` | デモ用。ファーストビュー動画の PC/SP src 切替・ミュート／音声オン別ボタン（`demo/demo-fv-video/`） |
| `src/assets/js/demo/_demo-api.js` | デモ用。JSONPlaceholder users の `fetch` と `li` による名前一覧（`demo/demo-api/`） |
| `src/assets/js/demo/_demo-share.js` | デモ用。SNS 共有 `href`（ビルド時は `shareTextStatic` に `staticPageUrl` 埋め込み、表示中は本文+改行+`location.href` を末尾に、Facebook は `u` のみ）（`demo/demo-share/`） |
| `src/assets/js/demo/_demo-sound.js` | デモ用。読み込み時 `<dialog>` で音声 ON/OFF を選び、ON 時のみ再生（`demo/demo-sound/`） |
| `src/assets/js/demo/_demo-random-page-nav.js` | デモ用。`sessionStorage` で表示済みスラッグを避けつつトップ／下層間をランダム遷移（`demo/demo-random-page-nav/`） |
| `src/ejs/components-demo/_p-random-page-nav.ejs` | デモ用。ランダムページ遷移（訪問済み除外）デモの共通マークアップ（ボタン・`data-*`） |
| `src/assets/js/_parallax.js` | 汎用パララックス（data-parallax でトリガー・移動量を指定） |
| `src/assets/sass/style.scss` | Sassエントリファイル |
| `src/assets/sass/base/_root.scss` | フォント・CSS変数（`:root`）。ライト/ダーク用の `--color-bg` / `--color-text` 等と `@media (prefers-color-scheme: dark)` による上書き |
| `src/assets/js/_theme-toggle.js` | **Demo用**。ライト/ダーク切り替えボタンのクリック処理。案件時は本ファイル削除と main.js の import 削除が必要 |
| `.github/workflows/deploy.yml` | CI/CD（FTPデプロイ + Discord通知） |

## 動画の Web 向け圧縮（エージェント）

- **手順の Skill（正本）**: `/Users/yoshiaki/working/2026-04-23kn/.cursor/skills/video-compress-web/SKILL.md`（ナレッジをマルチルートに含めない場合は `~/.cursor/skills/` へ同内容を置いてもよい）
- **技術手順の正本**: 本リポ `raw/videos/README-video-compress.md`／チャット依頼は README「動画圧縮を AI に依頼するとき」を参照
- **`raw/videos/` の正本は本リポのみ**（WP テンプレ・案件リポでは必要時にここから**手動複製**。README 内「WordPress・案件リポで使う場合」参照）
- **`compress-config.json`** は Git に含めず、`compress-config.sample.json` を `raw/videos/` にコピーして作成する
- **索引**: ナレッジ `wiki/asset-compression-notes.md`

## Web フォントの設置・圧縮（エージェント）

- **手順の Skill（正本）**: `/Users/yoshiaki/working/2026-04-23kn/.cursor/skills/font-setup-web/SKILL.md`
- **方針の正本**: ナレッジ `wiki/web-fonts-guidelines.md`
- **圧縮コマンドの正本**: 本リポ **`raw/fonts/README-font-compress.md`**（WP テンプレと**同じディレクトリ構成**）

## ドキュメント更新ルール

**いつ・何を文書化するか、ADR の基準**はナレッジ [`wiki/template-repository-docs.md`](/Users/yoshiaki/working/2026-04-23kn/wiki/template-repository-docs.md) を参照。以下は**このリポジトリで触るファイルのチェックリスト**である。

機能の追加・変更を行った場合、以下のドキュメントを必ず更新すること。

### docs/architecture.md
- セクション3「機能仕様」に新しいサブセクション（3.x）として追記する
- 記載すべき内容: 関連ファイル、動作仕様、使用方法
- 既存機能の変更の場合は、該当セクションを更新する
- **アクセシビリティ仮基準の本文（Must/Should 等）**を改訂した場合は、**ナレッジ** `/Users/yoshiaki/working/2026-04-23kn/wiki/a11y-baseline.md` のみを更新する。必要に応じて本リポの `docs/architecture.md`（3.22 節）やルート `README.md` の短い導線を同じ改訂に合わせる

### AGENTS.md
- 重要ファイルが増えた場合 →「重要ファイルと役割」テーブルに追加
- テンプレート固有の実装ルールを追加・変更した場合 →「コーディング規約」に追記・更新
- ビルドフローが変わった場合 →「ビルドフロー」を更新

### README.md
- npm scripts が増えた場合 →「スクリプト」セクションに追加
- site.config.js のオプションが増えた場合 →「サイト設定」セクションに追加

---

## コーディング規約

コーディング全般のルール・作業手順・判断基準は、**ナレッジベース** の `/Users/yoshiaki/working/2026-04-23kn/wiki/coding-conventions.md` を入口に参照すること（子ページ: `wiki/coding-*.md`）。旧ナレッジ用リポ `2026-03-20kn` は**廃止**した。  
このリポジトリには、**テンプレート固有**の実装ルールのみを記載する。  
実装中に迷ったときは、上記 `wiki` の該当トピックを `@` で指定して質問する。

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

### アクセシビリティ仮基準（段階的適用）

- **正本（共通）:** ナレッジベース `/Users/yoshiaki/working/2026-04-23kn/wiki/a11y-baseline.md`（**Must / Should / 運用 / チェックリスト**）。**基準の改訂はこの Wiki で行う**。
- **本リポの実装上の手がかり:** ルート [README.md](README.md) の「アクセシビリティ仮基準」、[docs/architecture.md](docs/architecture.md) の「3.22 アクセシビリティ仮基準」（stub ファイルは置かない）。
- **新規**（ページ・EJS・JS・Sass・デモ）: Wiki 正本の **Must** を当該範囲で満たす。
- **既存の修正**: 一括改修は求めない。**手を入れた範囲**で Must の違反を直し、無関係なファイルは触らない。

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
- `config/site.config.js` — デモページ定義（`demo` / `demoXxx` / `demoVariants` / `demoJavaScript` / `contact` / `thanks` / `privacy` キー）を削除し、`siteExternalLinks` を空オブジェクトに置換

**実行後の追加対応**
- `config/site.config.js` の `siteName` / `baseUrl` を案件情報に更新する
- ライト/ダーク機能自体が不要な場合は、`_head.ejs` の theme 用インラインスクリプトと `_root.scss` の `html[data-theme]` / `:root:not([data-theme])` まわりを削除する

