# XD デザインカンプ — ローカル入口（静的テンプレ）

XD JSON / PNG から EJS / HTML+SCSS（静的テンプレ）を書くときの**このリポの入口**。  
**コーディング規約の本文はここに持たない。**

## 汎用の正本（必読）

`/Users/yoshiaki/working/2026-04-23kn/wiki/camp-html-scss-implementation.md`

実装前に必ず Read すること（規約ポインタ・Sass/画像/XD 共通）。

## このリポの入口

| 内容 | パス |
|------|------|
| 案件入口 | [`AGENTS.md`](../../AGENTS.md) |
| 静的テンプレ固有 | [`ai-docs/architecture.md`](../architecture.md) |
| デザイントークン・レイアウト幅 | [`DESIGN-TOKENS.md`](./DESIGN-TOKENS.md) |
| 画像書き出し一覧 | [`IMAGE-EXPORT.md`](./IMAGE-EXPORT.md) |
| 作業手順（アートボード順・検証） | [`PROMPT.md`](./PROMPT.md) |
| Sass mixin | [`.cursor/rules/sass-use-mixins.mdc`](../../.cursor/rules/sass-use-mixins.mdc)（無ければナレッジ / 既存 mixin を Read） |

**ステップ 0（フォント・レイアウト幅）を飛ばさない**（`PROMPT.md`）。

## このテンプレの差分

- **スタック:** 静的（EJS）。画像はソース `src/assets/images/` → ビルド後 `/assets/images/…`。出力は `src/ejs/`、SCSS は `src/assets/sass/components/` 等。preload は `src/ejs/common/_head.ejs`。
- **SP カンプが無い案件**では PC を正とし、`mq()` で折返し・縦積み程度。SP がある場合は PC/SP 両方。
- XD 共通事項はナレッジ正本を参照。手順の詳細は [`PROMPT.md`](./PROMPT.md)。
