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
  "raw/videos/demo"
  "src/public/MailForm01_utf8"
)

for dir in "${dirs[@]}"; do
  target="$ROOT/$dir"
  if [ -d "$target" ]; then
    rm -rf "$target"
    echo "  削除: $dir"
  fi
done

files=(
  "src/ejs/data/posts.js"
)

for file in "${files[@]}"; do
  target="$ROOT/$file"
  if [ -f "$target" ]; then
    rm "$target"
    echo "  削除: $file"
  fi
done

# -------------------------------------------------------
# 2. main.js: ./demo/ への import 行を削除
# -------------------------------------------------------
MAIN_JS="$ROOT/src/assets/js/main.js"
if [ -f "$MAIN_JS" ]; then
  # Node.js で一括処理（マルチバイト文字・複数行コメントへの対応）
  MAIN_JS_PATH="$MAIN_JS" node --input-type=module << 'JSEOF'
import { readFileSync, writeFileSync } from 'fs';

const filePath = process.env.MAIN_JS_PATH;
let src = readFileSync(filePath, 'utf8');

// ./demo/ への import 行（行末コメント含む）を削除
src = src.replace(/^import ['"]\.\/demo\/[^\n]*\n?/gm, '');

// コメントアウトされた demo/ import 行を削除
src = src.replace(/^\/\/ import ['"][^'"]*['"][^\n]*\n?/gm, '');

// 「案件固有処理」ブロックの /** ... */ コメントブロックを削除
src = src.replace(/\/\*\*\n \* 案件固有処理[^\n]*\n \*\/\n?/g, '');

// /* xxx */ 形式の1行コメント（デモ機能カテゴリ見出し）を削除
const demoComments = [
  'スライダー', 'アコーディオン・トグル', 'モーダル', 'タブ切り替え',
  'スクロールに応じた表示制御', 'スクロールヒント', 'フォーム関連',
  'メールアドレス保護', 'ホバーエフェクト', 'ファーストビュー動画デモ',
  'JSONPlaceholder API デモ', '音声 ON/OFF dialog デモ',
  'ダークモード・ライトモード切り替え',
];
for (const label of demoComments) {
  src = src.replace(new RegExp(`^/\\* ${label} \\*/\\n?`, 'gm'), '');
}

// 連続する空行を1行に圧縮
src = src.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

writeFileSync(filePath, src);
JSEOF
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
  SITE_CONFIG_PATH="$SITE_CONFIG" node --input-type=module << 'EOF'
import { readFileSync, writeFileSync } from 'fs';

const filePath = process.env.SITE_CONFIG_PATH;
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
  // ネストした {} を含むオブジェクトブロックを削除
  // "  key: {" から対応する "}," までを行単位で除去
  const lines = src.split('\n');
  const result = [];
  let skip = false;
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!skip && new RegExp(`^  ${key}:\\s*\\{`).test(line)) {
      // 直前の行がコメント行なら result から取り除く
      if (result.length > 0 && /^\s*\/\//.test(result[result.length - 1])) {
        result.pop();
      }
      skip = true;
      depth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth <= 0) skip = false;
      continue;
    }
    if (skip) {
      depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (depth <= 0) skip = false;
      continue;
    }
    result.push(line);
  }
  src = result.join('\n');
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
