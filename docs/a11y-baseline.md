# アクセシビリティ仮基準（本リポジトリでは案内のみ）

**共通の仮基準の正本**は、ナレッジベース（第二の脳）の Wiki に置いています。本ファイルは**重複を避ける stub** です。内容の更新（版・Must/Should・履歴）は**Wiki 側**で行ってください。

| 正本 | ローカルパス（例） |
|------|-------------------|
| `wiki/a11y-baseline.md` | `/Users/yoshiaki/working/2026-04-23kn/wiki/a11y-baseline.md` |

マルチルートで開いている場合は、同一路径を `Read` や `@` 参照で指定してください。リモートや別マシンではパスを読み替えます。

---

## 本リポジトリ（Vite + EJS + Sass）固有の補足

- **属性値（`alt` / `aria-label` 等）:** EJS では `config/utils.js` の `ty_stripTags` 方針に従う。詳細は [AGENTS.md](../AGENTS.md) の「EJS の属性値出力」。
- **カラー / 面:** デモ・新規パーツは `src/assets/sass/base/_root.scss` の CSS 変数（`:root`）を使う。ライト/ダークは [AGENTS.md](../AGENTS.md) の「デモページ・コンポーネント追加時のカラー指定」。
- **`<dialog>` 等の部品例:** 型録として [src/demo/demo-dialog/index.html](../src/demo/demo-dialog/index.html) および `src/ejs/components-demo/_p-dialog*.ejs` を参照。

上記を除く **Must / Should / 段階的運用 / チェックリスト**は、**Wiki 正本**に従います。
