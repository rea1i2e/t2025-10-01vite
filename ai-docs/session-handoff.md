# セッション引き継ぎ — Cursor ↔ Claude Code

正本スキル: ナレッジベース `skills/cross-tool-session-handoff/SKILL.md`

## 守備範囲

`ai-docs/session-log.md` が持つのは **この案件の、いま生きている引き継ぎだけ**。読み手は次のチャット／別ツールの AI で、寿命は数時間〜数日。

| 中身 | 置き場 |
|---|---|
| 続き（`次`）・その打ち消し（`済`） | **このファイル** |
| 完了の蓄積 | Notion タスク実行ログ / 日報 / git log |
| 文脈が太い続き | `ai-docs/YYYY-MM-DD-continue-<slug>.md` |
| フックの事故ログ（リミット落ち等） | `ai-docs/session-snapshots.log` |
| 前日以前の `次` `済` | `ai-docs/archive/session-log-YYYY-MM.md`（自動退避） |

**Git:** 上記はすべて `.gitignore` 対象（個人の作業ログ。コミット・push しない）。

## 使い方

```bash
./scripts/session-log-live.sh                          # 生きている引き継ぎだけ読む
./scripts/session-log-append.sh 次 <slug> "続きの内容"   # 続きを残す
./scripts/session-log-append.sh 済 <slug>               # 自分の 次 を打ち消す
```

**このファイルを Edit / Write で開かない。** 複数チャットが同時に書くため、全文を読んで書き戻すと他チャットの行が消える。スクリプトは追記専用で `flock` 排他つき。

`<slug>` はチャットごとの課題名。他チャットの slug を使わない／打ち消さない。

## 3層構成（両方向共通）

| 層 | Claude Code | Cursor | 書く先 |
|----|-------------|--------|--------|
| 1 | `CLAUDE.md` 運用ルール | `.cursor/rules/session-handoff.mdc` | — |
| 2 | `/handoff` | 「引き継ぎ」指示 / `scripts/handoff-note.sh` | session-log |
| 3 | `StopFailure` フック | `sessionEnd` フック | スナップショット |

層3は事故ログ専用で session-log には触らない。意味のある `次` は層2で残す。

## Claude Code → Cursor

1. `/handoff`
2. Cursor 側で `./scripts/session-log-live.sh` の出力と作業中ファイルを渡して「続きから」

## Cursor → Claude Code

1. `claude` 起動（下記 cwd）
2. [`claude-code-resume-prompt.md`](claude-code-resume-prompt.md) をコピペ

```bash
cd リポジトリ/<slug> && claude
```

## 日をまたぐとき

当日以外の見出しは、次の追記時に `ai-docs/archive` へ自動退避される。ただし **`済` が無い `次` は当日へ `(繰越 MM-DD)` 付きで引き継がれる**ので、夜に中断して翌朝続けても消えない。

## 再インストール

```bash
python3 /path/to/2026-04-23kn/skills/cross-tool-session-handoff/scripts/install-handoff.py --target . --force
```
