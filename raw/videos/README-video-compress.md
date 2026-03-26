# 動画圧縮ツール

動画ファイルをWeb向けに圧縮するためのスクリプトです。

## 前提条件

- `ffmpeg` がインストールされていること

```bash
brew install ffmpeg
```

---

## 方法1: まとめて圧縮（推奨）

複数の動画を設定ファイルで管理し、一括で圧縮してレポートを生成します。

### セットアップ

`compress-config.sample.json` をコピーして `compress-config.json` を作成し、動画リストと設定を記述する。

```bash
cp raw/videos/compress-config.sample.json raw/videos/compress-config.json
```

### compress-config.json の構成

```json
{
  "defaults": {
    "scale": "1280:-2",
    "videoBitrate": "2000k",
    "audioBitrate": "128k",
    "fps": 30,
    "crf": 23,
    "preset": "slow"
  },
  "videos": [
    {
      "input": "raw/videos/top-mv.mp4",
      "output": "src/assets/videos/top-mv.mp4",
      "purpose": "hero",
      "sizeTarget": "3MB以下",
      "note": ""
    },
    {
      "input": "raw/videos/intro.mp4",
      "output": "src/assets/videos/intro.mp4",
      "purpose": "content",
      "sizeTarget": "",
      "note": "",
      "scale": "640:-2",
      "videoBitrate": "500k"
    }
  ]
}
```

- `defaults` に標準設定を書く
- `videos` の各動画に個別設定を書くと `defaults` を上書きできる
- `input` / `output` のパスは **`raw/videos/` を基準とした相対パス**（`compress-video.mjs` が `resolve(__dirname, …)` で解決する）。例: 入力 `demo/foo.mp4`、出力を `src/public` 配下に出すときは `../../src/public/assets/videos/demo/foo.mp4`

#### 方針・目標フィールド（`compression-video.md` の用途分類に対応）

| フィールド | 説明 |
|---|---|
| `purpose` | 用途。`hero` / `loop` / `content` のいずれかを指定 |
| `sizeTarget` | サイズ目標（例: `3MB以下`）。レポートに記載される |
| `note` | 備考（任意）。特記事項があれば記載 |
| `noCrf` | `true` のとき `-crf` を付けず、`-b:v`（と任意の `-maxrate` / `-bufsize`）によるレート制御に寄せる。長尺ヒーローでファイルサイズ上限を狙うときに使う |
| `maxrate` | （任意）映像の `-maxrate`。`noCrf` と組み合わせることが多い |
| `bufsize` | （任意）映像の `-bufsize`。`noCrf` と組み合わせることが多い |

**`purpose` の値と対応する方針**

| 値 | 用途 | 方針 |
|---|---|---|
| `hero` | ヒーロー動画 | WebM + MP4 の両方を用意。解像度は表示サイズに合わせて下げる |
| `loop` | ループ背景・装飾動画 | WebM + MP4 の両方を用意。できるだけ短く、解像度は表示サイズに合わせて下げる |
| `content` | コンテンツ動画（説明・紹介） | 外部サービスへの埋め込みを先に検討。自己ホストする場合は MP4（H.264）を基本とする |

### 実行

```bash
npm run compress:video
```

圧縮完了後、`raw/videos/compress-report.md` にレポートが生成される。
レポートには各動画の **方針・サイズ目標・圧縮前後の比較・実行コマンド** が記載される。

### 再圧縮の手順

1. `compress-report.md` を確認してサイズ・品質を判断する
2. `compress-config.json` の該当動画の設定を調整する
3. `npm run compress:video` を再実行する
4. レポートに試行結果が追記される

---

## 方法2: 1本ずつ手動圧縮

```bash
bash raw/videos/video-compress.sh <入力ファイル> <出力ファイル> [プリセット]
```

プリセットを省略した場合は `balance`（バランス型）が使用されます。

### プリセット一覧

| プリセット | 解像度 | ビットレート | 用途 |
|-----------|--------|-------------|------|
| `light`   | 720p   | 1.5Mbps     | ファイルサイズ優先。背景動画など |
| `balance` | 720p   | 2Mbps       | 画質とサイズのバランス（デフォルト） |
| `hq`      | 1080p  | 3Mbps       | 画質優先。メインビジュアルなど |

### 使用例

```bash
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-720p.mp4
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-720p-light.mp4 light
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-1080p.mp4 hq
```

---

## git 管理について

以下のファイルは `.gitignore` で管理対象外になっています。

- `raw/videos/*.mp4` など動画バイナリ
- `raw/videos/compress-config.json`（案件ごとに作成）
- `raw/videos/compress-report.md`（自動生成）

管理対象のファイル（テンプレートとして git に含める）:

- `compress-video.mjs`
- `compress-config.sample.json`
- `video-compress.sh`
- `README-video-compress.md`

---

## 注意事項

- `-movflags +faststart` により、ダウンロード完了前から再生が始まるWeb向け最適化が適用されます
- `scale` の `-2` は縦横比を維持したまま自動計算します（例: `640:-2` → 幅640pxで縦を自動算出）
