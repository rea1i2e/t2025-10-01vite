/**
 * Demo用：ライト/ダークモード切り替えボタン
 * 案件リポジトリ作成時は本ファイルを削除し、main.js の import を削除すること。
 */

const KEY = 'theme';

function getNextTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  return current === 'dark' ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(KEY, theme);
}

const btn = document.getElementById('js-theme-toggle');
if (btn) {
  btn.addEventListener('click', () => {
    applyTheme(getNextTheme());
  });
}
