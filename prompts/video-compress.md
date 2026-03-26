# Video Compress Prompt

> このファイルはプロンプトのテンプレートです。
> 案件で使う際は `prompts/video-compress.md`（テンプレートリポジトリ側）にコピー済みのファイルに案件情報を記入してください。

## 使い方

1. テンプレートリポジトリの `prompts/video-compress.md` を開く
2. 下のプロンプトをコピー
3. Cursor に貼る
4. `【動画ごとの用途・表示サイズ】` を埋める

---

## Prompt

```
以下の動画を圧縮したい。
`asset-compression/compression-video.md` の方針に従って `raw/videos/compress-config.json` を作成し、
`npm run compress:video` を実行してください。

## 手順

1. `npm run inspect:video` を実行して動画情報を確認する
2. 各動画の用途・表示サイズをもとに `compression-video.md` の方針・サイズ目標を確認する
3. `raw/videos/compress-config.sample.json` を参考に `compress-config.json` を作成する
4. `npm run compress:video` を実行する
5. 生成された `raw/videos/compress-report.md` を確認して結果を報告する
6. サイズ目標を達成していない動画があれば設定を調整して再圧縮する

## 参照ファイル

以下のファイルを @ で渡してください。
- `/Users/yoshiaki/working/2026-03-20kn/asset-compression/compression-video.md` （圧縮方針・サイズ目標）
- `raw/videos/compress-config.sample.json` （設定ファイルのサンプル）

## 【動画ごとの用途・表示サイズ】

- ファイル名.mp4: 用途（hero / loop / content）、表示サイズ ○○ × ○○px、音声あり/なし
raw/videos/demo/free-video1-sea-cafinet.mp4
hero
画面いっぱい

その他
dialog内
最大幅1000px
```
