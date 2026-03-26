#!/usr/bin/env node
/**
 * 動画まとめ圧縮スクリプト
 *
 * 使用方法:
 *   node raw/videos/compress-video.mjs
 *
 * 設定ファイル:
 *   raw/videos/compress-config.json を作成して動画リストと設定を記述する。
 *   サンプル: raw/videos/compress-config.sample.json
 *
 * レポート:
 *   圧縮完了後に raw/videos/compress-report.md を生成・追記する。
 */

import { execSync, spawnSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = resolve(__dirname, 'compress-config.json');
const REPORT_PATH = resolve(__dirname, 'compress-report.md');

// --- 用途ラベル（compression-video.md の用途分類に対応）---

const PURPOSE_LABELS = {
  hero: 'ヒーロー動画',
  loop: 'ループ背景・装飾動画',
  content: 'コンテンツ動画（説明・紹介）',
};

const PURPOSE_POLICIES = {
  hero: 'WebM + MP4 の両方を用意する。解像度は表示サイズに合わせて下げる。',
  loop: 'WebM + MP4 の両方を用意する。できるだけ短く、解像度は表示サイズに合わせて下げる。',
  content: '外部サービス（YouTube 等）への埋め込みを先に検討する。自己ホストする場合は MP4（H.264）を基本とする。',
};

// --- ユーティリティ ---

function formatBytes(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

function reductionRate(before, after) {
  return `${(((before - after) / before) * 100).toFixed(1)}%`;
}

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

function extractInfo(info) {
  if (!info) return null;
  const video = info.streams.find((s) => s.codec_type === 'video');
  const audio = info.streams.find((s) => s.codec_type === 'audio');
  return {
    width: video?.width ?? '-',
    height: video?.height ?? '-',
    videoBitrate: video?.bit_rate ? `${Math.round(video.bit_rate / 1000)} kbps` : '-',
    audioBitrate: audio?.bit_rate ? `${Math.round(audio.bit_rate / 1000)} kbps` : '-',
    duration: info.format?.duration ? `${parseFloat(info.format.duration).toFixed(2)} 秒` : '-',
    size: info.format?.size ? parseInt(info.format.size) : null,
  };
}

function buildFfmpegArgs(input, output, options) {
  const { scale, videoBitrate, audioBitrate, fps, crf, preset } = options;
  const vf = [scale ? `scale=${scale}` : null, fps ? `fps=${fps}` : null]
    .filter(Boolean)
    .join(',');

  const args = ['-i', input];
  if (vf) args.push('-vf', vf);
  args.push('-c:v', 'libx264');
  args.push('-preset', preset ?? 'slow');
  if (crf != null) args.push('-crf', String(crf));
  if (videoBitrate) args.push('-b:v', videoBitrate);
  args.push('-c:a', 'aac');
  if (audioBitrate) args.push('-b:a', audioBitrate);
  args.push('-movflags', '+faststart');
  args.push('-y', output);
  return args;
}

function buildCommand(input, output, options) {
  const args = buildFfmpegArgs(input, output, options);
  return `ffmpeg ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
}

// --- メイン処理 ---

if (!existsSync(CONFIG_PATH)) {
  console.error(`エラー: ${CONFIG_PATH} が見つかりません。`);
  console.error('compress-config.sample.json を参考に compress-config.json を作成してください。');
  process.exit(1);
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
const defaults = config.defaults ?? {};
const videos = config.videos ?? [];

if (videos.length === 0) {
  console.error('エラー: compress-config.json に videos が定義されていません。');
  process.exit(1);
}

const now = new Date();
const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
const results = [];

console.log(`\n動画圧縮を開始します（${videos.length} 本）\n`);

for (const video of videos) {
  const inputPath = resolve(__dirname, video.input);
  const outputPath = resolve(__dirname, video.output);

  if (!existsSync(inputPath)) {
    console.error(`スキップ: 入力ファイルが見つかりません → ${video.input}`);
    results.push({ video, skipped: true, reason: '入力ファイルが見つかりません' });
    continue;
  }

  const options = {
    scale: video.scale ?? defaults.scale,
    videoBitrate: video.videoBitrate ?? defaults.videoBitrate,
    audioBitrate: video.audioBitrate ?? defaults.audioBitrate,
    fps: video.fps ?? defaults.fps,
    crf: video.crf ?? defaults.crf,
    preset: video.preset ?? defaults.preset,
  };

  const beforeInfo = extractInfo(getVideoInfo(inputPath));
  const beforeSize = statSync(inputPath).size;
  const command = buildCommand(video.input, video.output, options);

  console.log(`▶ ${video.input} → ${video.output}`);
  console.log(`  コマンド: ${command}`);

  const ffmpegArgs = buildFfmpegArgs(inputPath, outputPath, options);
  const result = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`  失敗: ffmpeg がエラーで終了しました。`);
    results.push({ video, skipped: false, success: false, command, beforeInfo, beforeSize });
    continue;
  }

  const afterSize = statSync(outputPath).size;
  const afterInfo = extractInfo(getVideoInfo(outputPath));

  console.log(`  完了: ${formatBytes(beforeSize)} → ${formatBytes(afterSize)} (${reductionRate(beforeSize, afterSize)} 削減)\n`);

  results.push({
    video,
    skipped: false,
    success: true,
    command,
    beforeInfo,
    afterInfo,
    beforeSize,
    afterSize,
  });
}

// --- レポート生成 ---

const lines = [];

lines.push(`## 実行日時: ${timestamp}\n`);

for (const r of results) {
  lines.push(`### ${r.video.input} → ${r.video.output}\n`);

  if (r.skipped) {
    lines.push(`- スキップ: ${r.reason}\n`);
    continue;
  }

  // 方針・目標
  const purposeKey = r.video.purpose;
  const purposeLabel = purposeKey ? (PURPOSE_LABELS[purposeKey] ?? purposeKey) : '-';
  const policy = purposeKey ? (PURPOSE_POLICIES[purposeKey] ?? '-') : '-';
  const sizeTarget = r.video.sizeTarget || '-';
  const note = r.video.note || '';

  lines.push(`**方針**\n`);
  lines.push(`| 項目 | 内容 |`);
  lines.push(`|---|---|`);
  lines.push(`| 用途 | ${purposeLabel} |`);
  lines.push(`| 圧縮方針 | ${policy} |`);
  lines.push(`| サイズ目標 | ${sizeTarget} |`);
  if (note) lines.push(`| 備考 | ${note} |`);
  lines.push(``);

  if (!r.success) {
    lines.push(`- 結果: **失敗**\n`);
    lines.push(`- コマンド: \`${r.command}\`\n`);
    continue;
  }

  lines.push(`**結果**\n`);
  lines.push(`| 項目 | 圧縮前 | 圧縮後 |`);
  lines.push(`|---|---|---|`);
  lines.push(`| ファイルサイズ | ${formatBytes(r.beforeSize)} | ${formatBytes(r.afterSize)} |`);
  lines.push(`| 削減率 | — | ${reductionRate(r.beforeSize, r.afterSize)} |`);
  lines.push(`| 解像度 | ${r.beforeInfo?.width} × ${r.beforeInfo?.height} | ${r.afterInfo?.width} × ${r.afterInfo?.height} |`);
  lines.push(`| 映像ビットレート | ${r.beforeInfo?.videoBitrate} | ${r.afterInfo?.videoBitrate} |`);
  lines.push(`| 音声ビットレート | ${r.beforeInfo?.audioBitrate} | ${r.afterInfo?.audioBitrate} |`);
  lines.push(`| 尺 | ${r.beforeInfo?.duration} | ${r.afterInfo?.duration} |`);
  lines.push(``);
  lines.push(`\`\`\`bash`);
  lines.push(r.command);
  lines.push(`\`\`\``);
  lines.push(``);
}

lines.push(`---\n`);

const newEntry = lines.join('\n');

let reportContent = `# 動画圧縮レポート\n\n`;
if (existsSync(REPORT_PATH)) {
  const existing = readFileSync(REPORT_PATH, 'utf-8');
  const bodyStart = existing.indexOf('\n\n') + 2;
  reportContent = existing.slice(0, bodyStart) + newEntry + existing.slice(bodyStart);
} else {
  reportContent += newEntry;
}

writeFileSync(REPORT_PATH, reportContent, 'utf-8');
console.log(`レポートを出力しました: raw/videos/compress-report.md`);
