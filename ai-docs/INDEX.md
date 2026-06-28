# ai-docs 索引（静的テンプレ）

**技術ドキュメントの正本**（設計・機能仕様・npm scripts）と、案件複製後の **AI 向け追記**を置く。人間向け入口はルート [`README.md`](../README.md)。

## なぜ `docs/` ではなく `ai-docs/` か

- 案件サイトに **`/docs/` URL** や **`docs/` ディレクトリ**があることが多く、リポ内の「docs」と**名前がかぶって曖昧**になりやすい。
- 開発用 md は **FTP・納品対象外**と明示しやすい名前にする（[`legacy-wp-diff-export`](/Users/yoshiaki/working/2026-04-23kn/skills/legacy-wp-diff-export/SKILL.md) 既定除外と同型）。

詳細: ナレッジ [`wiki/template-repository-docs.md`](/Users/yoshiaki/working/2026-04-23kn/wiki/template-repository-docs.md)

## 正本（テンプレ共通）

| ファイル | 内容 |
|---|---|
| [`architecture.md`](architecture.md) | 設計・ディレクトリ・機能仕様・npm scripts の正本（A11y のテンプレ固有事項は 3.22 節） |

リポ固有の意思決定（ADR）が増えたら **`ai-docs/decisions/`** に置いてよい。**ADR の書き方・命名**はナレッジ [adr-workflow.md](/Users/yoshiaki/working/2026-04-23kn/wiki/adr-workflow.md)。汎用の考え方の例: [decision-minify-css-client-handoff.md](/Users/yoshiaki/working/2026-04-23kn/wiki/decision-minify-css-client-handoff.md)。

## 案件複製後に追記する例

| ファイル（例） | 用途 |
|---|---|
| `scss-coding-rules.md` | 既存 CSS 改修案件の Sass 規約・地雷 |
| `path-conventions.md` | 画像パス・インクルードの案件固有ルール |
| `skills/*.md` | 案件専用手順（正本化したらナレッジ `skills/` へ） |
| `YYYY-MM-DD-*.md` | 調査レポート（読み込み順・性能等） |

## トリガー（案件で増やしたとき）

| 作業 | 読むファイル |
|---|---|
| スタック共通・機能追加 | [`architecture.md`](architecture.md) |
| （案件で追加したルール） | 下表を更新 |

| ファイル | 要約 | 最終更新 |
|---|---|---|
| [`architecture.md`](architecture.md) | テンプレ技術正本 | — |
| （未追加） | — | — |

**メンテ:** ファイル追加・改訂時はこの索引表も更新する。
