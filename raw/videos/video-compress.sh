#!/bin/bash
# 動画圧縮コマンド
# 使用方法: ./raw/videos/video-compress.sh <入力ファイル> <出力ファイル> [プリセット]
# プリセット: light（軽量）/ balance（バランス）/ hq（高画質）
# 使用例: ./raw/videos/video-compress.sh ./raw/videos/top-mv.mp4 ./src/assets/videos/top-mv-720p.mp4 balance

if [ $# -lt 2 ]; then
  echo "使用方法: $0 <入力ファイル> <出力ファイル> [プリセット]"
  echo "プリセット: light / balance（デフォルト）/ hq"
  echo "例: $0 src/assets/videos/top-mv.mp4 src/assets/videos/top-mv-720p.mp4 balance"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"
PRESET="${3:-balance}"

if [ ! -f "$INPUT_FILE" ]; then
  echo "エラー: 入力ファイル '$INPUT_FILE' が見つかりません"
  exit 1
fi

case "$PRESET" in
  light)
    # 720p / 1.5Mbps（軽量型）
    ffmpeg -i "$INPUT_FILE" \
      -vf "scale=1280:720,fps=30" \
      -c:v libx264 \
      -preset slow \
      -crf 25 \
      -b:v 1500k \
      -maxrate 2000k \
      -bufsize 3000k \
      -c:a aac \
      -b:a 96k \
      -movflags +faststart \
      "$OUTPUT_FILE"
    ;;
  balance)
    # 720p / 2Mbps（バランス型）
    ffmpeg -i "$INPUT_FILE" \
      -vf "scale=1280:720,fps=30" \
      -c:v libx264 \
      -preset slow \
      -crf 23 \
      -b:v 2000k \
      -maxrate 2500k \
      -bufsize 4000k \
      -c:a aac \
      -b:a 128k \
      -movflags +faststart \
      "$OUTPUT_FILE"
    ;;
  hq)
    # 1080p / 3Mbps（高画質型）
    ffmpeg -i "$INPUT_FILE" \
      -vf "scale=1920:1080,fps=30" \
      -c:v libx264 \
      -preset slow \
      -crf 22 \
      -b:v 3000k \
      -maxrate 4000k \
      -bufsize 6000k \
      -c:a aac \
      -b:a 128k \
      -movflags +faststart \
      "$OUTPUT_FILE"
    ;;
  *)
    echo "エラー: 不明なプリセット '$PRESET'"
    echo "プリセット: light / balance / hq"
    exit 1
    ;;
esac

if [ $? -eq 0 ]; then
  echo "圧縮完了: $OUTPUT_FILE"
else
  echo "エラー: 動画圧縮に失敗しました"
  exit 1
fi
