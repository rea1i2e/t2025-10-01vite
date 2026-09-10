# Claude Code 再開プロンプト（Cursor からの引き継ぎ）

Cursor で作業を区切り、Claude Code で続けるときにコピペする。

## 起動

```bash
cd リポジトリ/<slug> && claude
```

---

## プロンプト（コピペ用）

```
Cursor から引き継ぎ。前提を読んでから返答して。

## 必読

1. `./scripts/session-log-live.sh` の出力（生きている引き継ぎ。session-log の全文は読まない）
2. git status / git diff（未コミットの途中成果）
3. CLAUDE.md



## 今回の依頼

session-log-live.sh に出た「次」を実行して。
続きの本文が continue md のパスなら、それを読んでから進めて。
（必要ならここに補足）
```

---

## 区切り前（Cursor 側）

```
引き継ぎ: 次を1行残して。続きは Claude Code でやる。
```

---

## 関連

- [`session-handoff.md`](session-handoff.md)
- [`claude-code-kickoff-prompt.md`](claude-code-kickoff-prompt.md)（あれば）
