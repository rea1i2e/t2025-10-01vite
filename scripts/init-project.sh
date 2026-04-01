#!/usr/bin/env bash
# 案件着手時にデモ用コードを一括削除するスクリプト
# 使用方法: npm run init

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "デモ用コードを削除します..."

# -------------------------------------------------------
# 1. ディレクトリ削除
# -------------------------------------------------------
dirs=(
  "src/demo"
  "src/ejs/components-demo"
  "src/assets/js/demo"
  "src/assets/sass/demo-components"
  "src/assets/images/demo"
  "src/assets/videos/demo"
  "src/assets/audio/demo-sound"
)

for dir in "${dirs[@]}"; do
  target="$ROOT/$dir"
  if [ -d "$target" ]; then
    rm -rf "$target"
    echo "  削除: $dir"
  fi
done

# -------------------------------------------------------
# 2. main.js: ./demo/ への import 行を削除
# -------------------------------------------------------
MAIN_JS="$ROOT/src/assets/js/main.js"
if [ -f "$MAIN_JS" ]; then
  sed -i '' '/import.*\.\/demo\//d' "$MAIN_JS"
  # demo/ import に関するコメント行（「案件固有処理」ブロック見出し等）も削除
  sed -i '' '/案件固有処理（必要に応じてdemoから移動して使用）/d' "$MAIN_JS"
  # 各機能カテゴリのコメント行を削除（/* ... */ 形式の行）
  sed -i '' '/^\/\* スライダー \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* アコーディオン・トグル \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* モーダル \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* タブ切り替え \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* スクロールに応じた表示制御 \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* スクロールヒント \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* フォーム関連 \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* メールアドレス保護 \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* ホバーエフェクト \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* ファーストビュー動画デモ \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* JSONPlaceholder API デモ \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* 音声 ON\/OFF dialog デモ \*\/$/d' "$MAIN_JS"
  sed -i '' '/^\/\* ダークモード・ライトモード切り替え \*\/$/d' "$MAIN_JS"
  # dialog-common のコメントアウト行も削除
  sed -i '' '/\/\/ import.*_dialog-common/d' "$MAIN_JS"
  # 「案件固有処理」ブロックの /** ... */ コメントブロックを削除
  sed -i '' '/\/\*\*/d' "$MAIN_JS"
  sed -i '' '/^ \* 案件固有処理/d' "$MAIN_JS"
  sed -i '' '/^ \*\//d' "$MAIN_JS"
  # 連続する空行を1行に圧縮
  node -e "
    const fs = require('fs');
    const content = fs.readFileSync('$MAIN_JS', 'utf8');
    const cleaned = content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
    fs.writeFileSync('$MAIN_JS', cleaned);
  "
  echo "  更新: src/assets/js/main.js"
fi

# -------------------------------------------------------
# 3. style.scss: demo-components の @use 行を削除
# -------------------------------------------------------
STYLE_SCSS="$ROOT/src/assets/sass/style.scss"
if [ -f "$STYLE_SCSS" ]; then
  sed -i '' '/demo-components/d' "$STYLE_SCSS"
  echo "  更新: src/assets/sass/style.scss"
fi

# -------------------------------------------------------
# 4. _footer.ejs: theme-toggle の include 行を削除
# -------------------------------------------------------
FOOTER_EJS="$ROOT/src/ejs/common/_footer.ejs"
if [ -f "$FOOTER_EJS" ]; then
  sed -i '' '/components-demo\/_theme-toggle/d' "$FOOTER_EJS"
  echo "  更新: src/ejs/common/_footer.ejs"
fi

# -------------------------------------------------------
# 5. site.config.js: デモページ定義を削除
#    demo / demoXxx / contact / thanks / privacy / x キーを削除
# -------------------------------------------------------
SITE_CONFIG="$ROOT/config/site.config.js"
if [ -f "$SITE_CONFIG" ]; then
  node --input-type=module << 'EOF'
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(process.env.SITE_CONFIG_PATH);
let src = readFileSync(filePath, 'utf8');

// 削除対象キー（demo で始まるもの + contact/thanks/privacy/x）
const demoKeys = [
  'demo', 'demoAccordion', 'demoDialog', 'demoTab', 'demoSplide',
  'demoFvVideo', 'demoSound', 'demoScrollAnimation', 'demoParallax',
  'demoTextDecoration', 'demoCssAnime', 'demoGridLayout',
  'demoHoverButton', 'demoHoverText', 'demoHoverCard',
  'demoCurrentSection', 'demoHoverChange', 'demoDocument',
  'demoMedia', 'demoApi',
  'contact', 'thanks', 'privacy', 'x',
];

for (const key of demoKeys) {
  // キーから始まるオブジェクトブロック（コメント行含む）を削除
  // パターン: 行頭の任意コメント行 + "  key: {" から "}," まで
  const pattern = new RegExp(
    `(\\n  // [^\\n]*)?\\n  ${key}: \\{[^}]*(?:\\{[^}]*\\}[^}]*)*\\},`,
    'g'
  );
  src = src.replace(pattern, '');
}

// 「// 外部リンク設置例」コメント行も削除（x キー削除後に残る場合）
src = src.replace(/\n  \/\/ 外部リンク設置例\n/g, '\n');

// 連続する空行を1行に圧縮
src = src.replace(/\n{3,}/g, '\n\n');

writeFileSync(filePath, src);
console.log('  更新: config/site.config.js');
EOF
fi

echo ""
echo "完了しました。"
echo "不要なデモコードが削除されました。"
echo "次のステップ:"
echo "  1. config/site.config.js の siteName / baseUrl を案件情報に更新"
echo "  2. npm run dev で動作確認"
