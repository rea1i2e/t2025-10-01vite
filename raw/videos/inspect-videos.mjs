#!/usr/bin/env node
/**
 * 動画情報サマリー出力スクリプト
 *
 * 使用方法:
 *   node raw/videos/inspect-videos.mjs
 *   npm run inspect:video
 *
 * raw/videos/ 内の .mp4 ファイルの情報をサマリー形式で出力する。
 * AIへの動画圧縮依頼時に、この出力をプロンプトに貼り付けて使う。
 */

import { spawnSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getVideoInfo(filePath) {
  const result = spawnSync('ffprobe', [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    '-show_format',
    filePath,
  ]);
  if (result.status !== 0) return null;
  return JSON.parse(result.stdout.toString());
}

function formatBytes(bytes) {
  const mb = parseInt(bytes) / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

const files = readdirSync(__dirname)
  .filter((f) => f.endsWith('.mp4'))
  .sort();

if (files.length === 0) {
  console.log('raw/videos/ に .mp4 ファイルが見つかりません。');
  process.exit(0);
}

for (const file of files) {
  const filePath = resolve(__dirname, file);
  const info = getVideoInfo(filePath);

  if (!info) {
    console.log(`=== ${file} ===`);
    console.log('  情報取得失敗\n');
    continue;
  }

  const video = info.streams.find((s) => s.codec_type === 'video');
  const audio = info.streams.find((s) => s.codec_type === 'audio');
  const fmt = info.format;

  const size = fmt?.size ? formatBytes(fmt.size) : '-';
  const duration = fmt?.duration ? `${parseFloat(fmt.duration).toFixed(1)} 秒` : '-';
  const width = video?.width ?? '-';
  const height = video?.height ?? '-';
  const videoBitrate = video?.bit_rate ? `${Math.round(parseInt(video.bit_rate) / 1000)} kbps` : '-';
  const audioBitrate = audio?.bit_rate ? `${Math.round(parseInt(audio.bit_rate) / 1000)} kbps` : null;
  const audioLabel = audio ? `あり（${audioBitrate}）` : 'なし';

  console.log(`=== ${file} ===`);
  console.log(`  サイズ: ${size}`);
  console.log(`  解像度: ${width} × ${height}`);
  console.log(`  尺: ${duration}`);
  console.log(`  映像ビットレート: ${videoBitrate}`);
  console.log(`  音声: ${audioLabel}`);
  console.log('');
}
