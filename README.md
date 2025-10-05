# t2025-10-01vite

Vite + EJS + Sass 構成の静的サイトテンプレート。ビルド時に画像圧縮と WebP/AVIF 生成、HTML の <img> を <picture> 最適化、width/height 自動付与を行います。（AVIF生成は準備中）

## 必要要件
準備中

## セットアップ
```bash
npm install
```

## スクリプト
- 開発サーバー: EJS/HTML/Sass/JS を監視して自動反映
```bash
npm run dev
```

- 本番ビルド: `dist/` に出力 + ビルド後最適化（after-build）
※ ビルドに時webP生成、picture, sourceタグ挿入、width/height自動付与
```bash
npm run build
```

- ビルド確認（簡易サーバー）
※ビルド後のファイルをブラウザで確認
```bash
npm run preview
# もしくは
npm run build:preview
```

- 不要なファイル削除
```bash
npm run clean        # dist と一時生成を削除
npm run clean:all    # + node_modules と lock も削除
npm run reinstall    # クリーン後に再インストール
```

## ディレクトリ構成（主要）
```
src/                 # 開発用ルート（Vite root）
  index.html         # エントリ（複数HTML対応）
  about/index.html
  ejs/               # EJS パーツとレイアウト
    layouts/layout.ejs
    components/(_head.ejs, _header.ejs, _footer.ejs)
    main/(_top.ejs, _about.ejs)
  assets/
    sass/            # Sass（グロブインポート対応）
    js/              # JSモジュール
    images/          # 画像（dummy/common）
dist/                # 本番出力（ビルド生成物）
scripts/after-build.mjs  # HTML後処理スクリプト
vite.config.js
```

## 開発フロー
1. `npm run dev` を実行
2. `src/` 以下を編集（EJS/HTML/Sass/JS）
3. ビルドは `npm run build`、出力は `dist/`

## EJS の使い方
- `vite-plugin-ejs` により、HTML でも EJS テンプレが利用できます。
- 既定変数（`vite.config.js` 内）:
  - `siteName`: サイト名
  - `siteUrl`: サイトURL
- `src/index.html` などから `ejs/layouts/layout.ejs` をレイアウトとして読み込み、`ejs/components` をインクルードして組み立てる想定です。

## Sass/スタイル
- `vite-plugin-sass-glob-import` により、Sass のグロブインポートが可能です。
- `src/assets/sass/style.scss` をエントリに、`base/`, `components/`, `layouts/`, `utility/` へ分割。

## 画像最適化（ビルド時）
- プラグイン: `@vheemstra/vite-plugin-imagemin`
- 圧縮対象: PNG/JPEG/GIF/SVG
- 生成:
  - WebP: JPEG/PNG/GIF から生成
  - AVIF: after-build 時に既存ファイルがあれば `<source>` を挿入（生成自体はプラグイン外管理）
- 出力パス:
  - 画像: `assets/images/[name]-[hash][ext]`
  - CSS: `assets/css/[name]-[hash].css`
  - JS: `assets/js/[name]-[hash].js`

## after-build（HTML 後処理）の挙動
- 対象: `dist/**/*.html`
- 処理内容:
  - `<img>` に `width`/`height` を自動付与（実寸を `sharp` で取得）
  - WebP/AVIF が `dist` に存在する場合、`<picture>` 化して `<source>` を自動挿入
  - 既存 `<picture>` がある場合は崩さず、不足する `<source>` のみ追加
  - `<source>` それぞれにも参照ファイルの実寸を付与
  - 最後に HTML を整形（`js-beautify`）
- スキップ条件:
  - 外部 URL / `data:` 画像
  - 非ラスタ（SVG を `<picture>` 化はしません）
- ログ:
  - 変換件数、寸法付与のみの件数を標準出力に表示

## ビルド入力（複数 HTML 対応）
- `globSync("src/**/*.html")` をエントリーとして登録
- `src/` 以下に HTML を追加すると、自動的にビルド対象に含まれます

## よくあるトラブル
- `sharp` のビルド/インストール失敗
  - macOS: Xcode Command Line Tools の導入を確認
  - Node のメジャー更新後は `npm rebuild sharp` を試す
- 権限エラー
  - `dist/` やプロジェクトルートの書き込み権限を確認
- 画像が `<picture>` 化されない
  - 対象拡張子か、対応 WebP/AVIF が `dist` に存在するか確認
  - `data:` や外部 URL は対象外

## ライセンス
プロジェクトに合わせて追記してください。


