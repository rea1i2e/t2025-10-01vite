# 動画圧縮レポート

## 実行日時: 2026/3/26 12:33:37

### demo/free-video1-sea-cafinet.mp4 → ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | ヒーロー動画 |
| 圧縮方針 | WebM + MP4 の両方を用意する。解像度は表示サイズに合わせて下げる。 |
| サイズ目標 | 3MB以下 |
| 備考 | ヒーロー・画面いっぱい。30秒・3MB目標のため ABR（noCrf + maxrate） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 37.30 MB | 2.65 MB |
| 削減率 | — | 92.9% |
| 解像度 | 1920 × 1080 | 854 × 480 |
| 映像ビットレート | 10094 kbps | 682 kbps |
| 音声ビットレート | 317 kbps | 48 kbps |
| 尺 | 30.03 秒 | 30.04 秒 |

```bash
ffmpeg -i demo/free-video1-sea-cafinet.mp4 -vf scale=854:-2,fps=30 -c:v libx264 -preset slow -b:v 680k -maxrate 680k -bufsize 1360k -c:a aac -b:a 48k -movflags +faststart -y ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4
```

### demo/elephant.mp4 → ../../src/public/assets/videos/demo/elephant.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ・メディアデモ。元25fps維持・ABRで元サイズ以下を狙う |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 1.09 MB | 0.72 MB |
| 削減率 | — | 34.4% |
| 解像度 | 640 × 360 | 640 × 360 |
| 映像ビットレート | 495 kbps | 403 kbps |
| 音声ビットレート | 128 kbps | 2 kbps |
| 尺 | 14.57 秒 | 14.57 秒 |

```bash
ffmpeg -i demo/elephant.mp4 -vf scale=640:-2,fps=25 -c:v libx264 -preset slow -b:v 400k -maxrate 400k -bufsize 800k -c:a aac -b:a 96k -movflags +faststart -y ../../src/public/assets/videos/demo/elephant.mp4
```

### demo/forest.mp4 → ../../src/public/assets/videos/demo/forest.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | FV PC用・メディアデモ。アップスケールしない（元426幅） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.61 MB | 0.41 MB |
| 削減率 | — | 31.5% |
| 解像度 | 426 × 240 | 426 × 240 |
| 映像ビットレート | 323 kbps | 220 kbps |
| 音声ビットレート | - | - |
| 尺 | 15.58 秒 | 15.57 秒 |

```bash
ffmpeg -i demo/forest.mp4 -vf scale=426:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 350k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/forest.mp4
```

### demo/moon.mp4 → ../../src/public/assets/videos/demo/moon.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ内。元解像度維持・無音入力 |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.14 MB | 0.09 MB |
| 削減率 | — | 34.8% |
| 解像度 | 640 × 360 | 640 × 360 |
| 映像ビットレート | 84 kbps | 54 kbps |
| 音声ビットレート | - | - |
| 尺 | 12.77 秒 | 12.77 秒 |

```bash
ffmpeg -i demo/moon.mp4 -vf scale=640:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 200k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/moon.mp4
```

---
## 実行日時: 2026/3/26 12:32:41

### demo/free-video1-sea-cafinet.mp4 → ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | ヒーロー動画 |
| 圧縮方針 | WebM + MP4 の両方を用意する。解像度は表示サイズに合わせて下げる。 |
| サイズ目標 | 3MB以下 |
| 備考 | ヒーロー・画面いっぱい。30秒・3MB目標のため ABR（noCrf + maxrate） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 37.30 MB | 2.65 MB |
| 削減率 | — | 92.9% |
| 解像度 | 1920 × 1080 | 854 × 480 |
| 映像ビットレート | 10094 kbps | 683 kbps |
| 音声ビットレート | 317 kbps | 48 kbps |
| 尺 | 30.03 秒 | 30.04 秒 |

```bash
ffmpeg -i demo/free-video1-sea-cafinet.mp4 -vf scale=854:-2,fps=30 -c:v libx264 -preset slow -b:v 680k -maxrate 680k -bufsize 1360k -c:a aac -b:a 48k -movflags +faststart -y ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4
```

### demo/elephant.mp4 → ../../src/public/assets/videos/demo/elephant.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ・メディアデモ。最大表示1000px相当（元解像度を維持） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 1.09 MB | 1.88 MB |
| 削減率 | — | -72.0% |
| 解像度 | 640 × 360 | 640 × 360 |
| 映像ビットレート | 495 kbps | 1069 kbps |
| 音声ビットレート | 128 kbps | 2 kbps |
| 尺 | 14.57 秒 | 14.57 秒 |

```bash
ffmpeg -i demo/elephant.mp4 -vf scale=640:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 550k -c:a aac -b:a 96k -movflags +faststart -y ../../src/public/assets/videos/demo/elephant.mp4
```

### demo/forest.mp4 → ../../src/public/assets/videos/demo/forest.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | FV PC用・メディアデモ。アップスケールしない（元426幅） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.61 MB | 0.41 MB |
| 削減率 | — | 31.5% |
| 解像度 | 426 × 240 | 426 × 240 |
| 映像ビットレート | 323 kbps | 220 kbps |
| 音声ビットレート | - | - |
| 尺 | 15.58 秒 | 15.57 秒 |

```bash
ffmpeg -i demo/forest.mp4 -vf scale=426:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 350k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/forest.mp4
```

### demo/moon.mp4 → ../../src/public/assets/videos/demo/moon.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ内。元解像度維持・無音入力 |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.14 MB | 0.09 MB |
| 削減率 | — | 34.8% |
| 解像度 | 640 × 360 | 640 × 360 |
| 映像ビットレート | 84 kbps | 54 kbps |
| 音声ビットレート | - | - |
| 尺 | 12.77 秒 | 12.77 秒 |

```bash
ffmpeg -i demo/moon.mp4 -vf scale=640:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 200k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/moon.mp4
```

---
## 実行日時: 2026/3/26 12:31:18

### demo/free-video1-sea-cafinet.mp4 → ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | ヒーロー動画 |
| 圧縮方針 | WebM + MP4 の両方を用意する。解像度は表示サイズに合わせて下げる。 |
| サイズ目標 | 3MB以下 |
| 備考 | ヒーロー・画面いっぱい。30秒・3MB目標のため解像度・ビットレートを抑える |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 37.30 MB | 5.71 MB |
| 削減率 | — | 84.7% |
| 解像度 | 1920 × 1080 | 960 × 540 |
| 映像ビットレート | 10094 kbps | 1520 kbps |
| 音声ビットレート | 317 kbps | 64 kbps |
| 尺 | 30.03 秒 | 30.04 秒 |

```bash
ffmpeg -i demo/free-video1-sea-cafinet.mp4 -vf scale=960:-2,fps=30 -c:v libx264 -preset slow -crf 28 -b:v 650k -c:a aac -b:a 64k -movflags +faststart -y ../../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4
```

### demo/elephant.mp4 → ../../src/public/assets/videos/demo/elephant.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ・メディアデモ。最大幅1000px相当 |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 1.09 MB | 3.97 MB |
| 削減率 | — | -264.0% |
| 解像度 | 640 × 360 | 1000 × 562 |
| 映像ビットレート | 495 kbps | 2275 kbps |
| 音声ビットレート | 128 kbps | 2 kbps |
| 尺 | 14.57 秒 | 14.57 秒 |

```bash
ffmpeg -i demo/elephant.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 800k -c:a aac -b:a 96k -movflags +faststart -y ../../src/public/assets/videos/demo/elephant.mp4
```

### demo/forest.mp4 → ../../src/public/assets/videos/demo/forest.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | FV PC用・メディアデモ。最大幅1000px相当（ループ・無音素材） |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.61 MB | 1.44 MB |
| 削減率 | — | -138.5% |
| 解像度 | 426 × 240 | 1000 × 564 |
| 映像ビットレート | 323 kbps | 775 kbps |
| 音声ビットレート | - | - |
| 尺 | 15.58 秒 | 15.57 秒 |

```bash
ffmpeg -i demo/forest.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 800k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/forest.mp4
```

### demo/moon.mp4 → ../../src/public/assets/videos/demo/moon.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ内。最大幅1000px相当・無音 |

**結果**

| 項目 | 圧縮前 | 圧縮後 |
|---|---|---|
| ファイルサイズ | 0.14 MB | 0.16 MB |
| 削減率 | — | -19.4% |
| 解像度 | 640 × 360 | 1000 × 562 |
| 映像ビットレート | 84 kbps | 103 kbps |
| 音声ビットレート | - | - |
| 尺 | 12.77 秒 | 12.77 秒 |

```bash
ffmpeg -i demo/moon.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 600k -c:a aac -b:a 128k -movflags +faststart -y ../../src/public/assets/videos/demo/moon.mp4
```

---
## 実行日時: 2026/3/26 12:31:07

### demo/free-video1-sea-cafinet.mp4 → ../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | ヒーロー動画 |
| 圧縮方針 | WebM + MP4 の両方を用意する。解像度は表示サイズに合わせて下げる。 |
| サイズ目標 | 3MB以下 |
| 備考 | ヒーロー・画面いっぱい。30秒・3MB目標のため解像度・ビットレートを抑える |

- 結果: **失敗**

- コマンド: `ffmpeg -i demo/free-video1-sea-cafinet.mp4 -vf scale=960:-2,fps=30 -c:v libx264 -preset slow -crf 28 -b:v 650k -c:a aac -b:a 64k -movflags +faststart -y ../src/public/assets/videos/demo/free-video1-sea-cafinet.mp4`

### demo/elephant.mp4 → ../src/public/assets/videos/demo/elephant.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ・メディアデモ。最大幅1000px相当 |

- 結果: **失敗**

- コマンド: `ffmpeg -i demo/elephant.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 800k -c:a aac -b:a 96k -movflags +faststart -y ../src/public/assets/videos/demo/elephant.mp4`

### demo/forest.mp4 → ../src/public/assets/videos/demo/forest.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | FV PC用・メディアデモ。最大幅1000px相当（ループ・無音素材） |

- 結果: **失敗**

- コマンド: `ffmpeg -i demo/forest.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 800k -c:a aac -b:a 128k -movflags +faststart -y ../src/public/assets/videos/demo/forest.mp4`

### demo/moon.mp4 → ../src/public/assets/videos/demo/moon.mp4

**方針**

| 項目 | 内容 |
|---|---|
| 用途 | コンテンツ動画（説明・紹介） |
| 圧縮方針 | 外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。 |
| サイズ目標 | - |
| 備考 | ダイアログ内。最大幅1000px相当・無音 |

- 結果: **失敗**

- コマンド: `ffmpeg -i demo/moon.mp4 -vf scale=1000:-2,fps=30 -c:v libx264 -preset slow -crf 23 -b:v 600k -c:a aac -b:a 128k -movflags +faststart -y ../src/public/assets/videos/demo/moon.mp4`

---
