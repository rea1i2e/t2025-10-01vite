# 動画圧縮 プロンプト下書き

> テンプレート: `/Users/yoshiaki/working/2026-03-20kn/prompts/video-compress.md`
> ナレッジリポジトリのテンプレートをコピーしたファイルです。案件ごとの動画情報・用途・表示サイズを記入して使う。

---

## 事前準備: 動画情報の取得

以下のコマンドを実行して、ターミナルの出力をプロンプトに貼り付ける。

```bash
npm run inspect:video
```

サイズ・解像度・尺・ビットレート・音声の有無がサマリー形式で出力される。

---

## 下書き

```
以下の動画を圧縮したい。
`asset-compression/compression-video.md` の方針に従って `raw/videos/compress-config.json` を作成し、
`npm run compress:video` を実行してください。

## 手順

1. 各動画の用途・表示サイズをもとに `compression-video.md` の方針・サイズ目標を確認する
2. `raw/videos/compress-config.sample.json` を参考に `compress-config.json` を作成する
3. `npm run compress:video` を実行する
4. 生成された `raw/videos/compress-report.md` を確認して結果を報告する
5. サイズ目標を達成していない動画があれば設定を調整して再圧縮する

## 参照ファイル

以下のファイルを @ で渡してください。
- `/Users/yoshiaki/working/2026-03-20kn/asset-compression/compression-video.md` （圧縮方針・サイズ目標）
- `raw/videos/compress-config.sample.json` （設定ファイルのサンプル）

## 【動画情報】

（ffprobe の出力をここに貼る）

## 【動画ごとの用途・表示サイズ】

- ファイル名.mp4: 用途（hero / loop / content）、表示サイズ ○○ × ○○px、音声あり/なし
```
