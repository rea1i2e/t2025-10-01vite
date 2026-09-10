---
description: 中断するとき、ai-docs/session-log.md に「次」を1行残す
---

このチャットを中断し、続きを別チャット／別ツールへ渡す。

## やること

1. まず `./scripts/session-log-live.sh` で、いま生きている引き継ぎを確認する
2. **このチャットに続きがあるか**を判断する
   - 一段落した（続きなし）→ 自分が過去に出した `次` があれば打ち消して終わり:
     `./scripts/session-log-append.sh 済 <slug>`
   - 続きがある → 3へ
3. 文脈が太い（制約・必読ファイル・完了条件が要る）なら先に
   `ai-docs/YYYY-MM-DD-continue-<slug>.md` を書く（型はナレッジ `skills/chat-end-wrap-up/references/continue-template.md`）
4. 1行残す。`<slug>` はこのチャットの課題名。他チャットの slug を使わない:

   ```bash
   ./scripts/session-log-append.sh 次 <slug> "続きの内容（continue md があればそのパス）"
   ```

5. 外部正本（読取専用パス）があれば触らない: （読取専用の外部正本があれば触らない）

## やらないこと

- **`ai-docs/session-log.md` を Edit / Write で開かない。** 他チャットの行を消す
- 他チャットが出した `次` を `済` にしない。打ち消せるのは自分が出した slug だけ
- 完了の記録をここに書かない（Notion タスクログ・日報・git log が正本）

追加の説明が `$ARGUMENTS` にあれば反映する。
