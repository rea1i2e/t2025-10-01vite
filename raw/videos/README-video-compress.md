# 動画圧縮ツール

動画ファイルをWeb向けに圧縮するためのスクリプトです。

## 初回セットアップ（1回だけ実行）

### 前提条件

- `ffmpeg` がインストールされていること

### ffmpegのインストール（初回のみ）

```bash
brew install ffmpeg
```

## 使用方法

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

**バランス型（デフォルト）:**
```bash
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-720p.mp4
```

**軽量型:**
```bash
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-720p-light.mp4 light
```

**高画質型:**
```bash
bash raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-1080p.mp4 hq
```

## 出力ファイルの配置

圧縮した動画ファイルは `src/assets/videos/` に配置してください。

## 注意事項

- `-movflags +faststart` により、ダウンロード完了前から再生が始まるWeb向け最適化が適用されます
- 音声なし動画の場合も `-c:a aac` オプションは無視されるため、そのまま実行できます
- 元ファイルより解像度が低い場合、`scale` フィルタによりアップスケールされます。元解像度を維持したい場合はプリセットの `scale` 値を調整してください
