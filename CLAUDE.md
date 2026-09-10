# CLAUDE.md

## セッション引き継ぎ（Cursor ↔ Claude Code）

`ai-docs/session-log.md` が持つのは **この案件の、いま生きている引き継ぎだけ**。
行は `次`（続き）と `済`（打ち消し）の2種のみ。完了の蓄積は Notion タスクログ・日報・git log が正本。

- **このファイルを Edit / Write で開かない。** 複数チャットが同時に書くため、全文書き戻しは他チャットの行を消す
- 書き込みは必ずスクリプト経由（追記専用・排他つき）:
  - 続きを残す: `./scripts/session-log-append.sh 次 <slug> "続きの内容"`
  - 自分の 次 を打ち消す: `./scripts/session-log-append.sh 済 <slug>`
- 読み出しは `./scripts/session-log-live.sh`（`済` のない `次` だけ出る）。全文は読まない
- `<slug>` は課題名（例 `email-explain`）。**チャットごとに固有**にして、他チャットの `次` と混ぜない
- **中断のときだけ書く。** 終了（一段落）なら `済` を出して終わる。続きが無いなら何も書かない
- 文脈が太い続きは `ai-docs/YYYY-MM-DD-continue-<slug>.md` に書き、`次` の本文にはそのパスだけ置く
- **Claude Code**: リミットが近い・別ツールへ渡すときは `/handoff`
- **Cursor から Claude Code へ渡すとき**: 更新後 `ai-docs/claude-code-resume-prompt.md` をコピペして再開
- 詳細: `ai-docs/session-handoff.md` ／ 正本スキル: ナレッジベース `skills/cross-tool-session-handoff/SKILL.md`

## Figma デザイン（mapping ストック）

- 通常実装の正本スキル: ナレッジベース `skills/figma-design-implementation/SKILL.md`

- 案件で Figma URL を受け取ったら **1回だけ** [`ai-docs/figma-design-kickoff-prompt.md`](ai-docs/figma-design-kickoff-prompt.md) で `ai-docs/figma-design-mapping.md` を整備する
- 以降のコーディングは [`ai-docs/figma-design-section-prompt.md`](ai-docs/figma-design-section-prompt.md) に従い **1セクションずつ** Figma MCP → 実装（ページ一括は禁止）
- **セクション実装後（省略禁止）**: 「セルフQA不要」の明示がなければ [`ai-docs/pre-human-qa-loop-prompt.md`](ai-docs/pre-human-qa-loop-prompt.md) で当該セクションのセルフQA（最大2周）→ `fb/qa` 残件 → 人間チェック待ち。正本: ナレッジ `wiki/ai-pre-human-qa-and-fb-rounds.md`
- 修正 FB は [`ai-docs/fb/`](ai-docs/fb/README.md)（`qa`＝制作側カンプ差分 / `client`＝先方回次で再現・変更混在可）。`qa` と client の `再現` は原因解明→修正→ブラウザ確認（`figma-qa-compare` は `fb/qa/` へ転記可）
- 正本 Figma 差し替え: ナレッジ `skills/figma-design-refresh-pixexport/SKILL.md`
