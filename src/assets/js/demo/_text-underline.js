/**
 * 下線ホバーアニメーション（data-hover-underline）
 * 下線が左から右へ伸びて、左から右へ消える
 * a, button, summaryの子要素にカスタムデータ属性data-hover-underlineを付与
 */

const UNDERLINE_SELECTOR = '[data-hover-underline]';
const TRIGGER_SELECTOR = 'a, button, summary';
const CLASS_EXPANDED = 'is-expanded';
const CLASS_CONTRACTING = 'is-contracting';
const ANIMATION_NAME_CONTRACT = 'contract';

/**
 * 指定要素の子孫にあるアンダーライン要素をすべて取得する
 * @param {Element} container - 検索対象の親要素（トリガー）
 * @returns {Element[]}
 */
function getUnderlinesIn(container) {
  return Array.from(container.querySelectorAll(UNDERLINE_SELECTOR));
}

/**
 * ホバー／フォーカス時に下線を伸ばす。トリガー内のアンダーライン要素に is-expanded を付与する
 * @param {Element} trigger - トリガー要素（a, button, summary）
 */
function expand(trigger) {
  const underlines = getUnderlinesIn(trigger);
  underlines.forEach((el) => {
    el.classList.remove(CLASS_CONTRACTING);
    el.classList.add(CLASS_EXPANDED);
  });
}

/**
 * ホバー／フォーカス解除時に下線を縮める。is-expanded を外し、is-contracting を付与して縮むアニメーションを開始する
 * @param {Element} trigger - トリガー要素（a, button, summary）
 */
function contract(trigger) {
  const underlines = getUnderlinesIn(trigger);
  underlines.forEach((el) => {
    el.classList.remove(CLASS_EXPANDED);
    el.classList.add(CLASS_CONTRACTING);
  });
}

/**
 * 縮むアニメーション（contract）終了時に is-contracting を外し、初期状態に戻す
 * @param {AnimationEvent} e - animationend イベント
 */
function handleAnimationEnd(e) {
  if (e.animationName !== ANIMATION_NAME_CONTRACT) return;
  e.target.classList.remove(CLASS_CONTRACTING);
}

/**
 * トリガーに mouseenter / mouseleave / focus / blur を登録し、アンダーライン要素に animationend を登録する
 * @param {Element} trigger - トリガー要素（a, button, summary）
 */
function bindTrigger(trigger) {
  trigger.addEventListener('mouseenter', () => expand(trigger));
  trigger.addEventListener('mouseleave', () => contract(trigger));
  trigger.addEventListener('focus', () => expand(trigger));
  trigger.addEventListener('blur', () => contract(trigger));

  getUnderlinesIn(trigger).forEach((el) => {
    el.addEventListener('animationend', handleAnimationEnd);
  });
}

/**
 * ページ内の data-hover-underline を検出し、それぞれのトリガーにイベントをバインドする。同一トリガーは一度だけ処理する
 */
function initTextUnderline() {
  const underlines = document.querySelectorAll(UNDERLINE_SELECTOR);
  const processed = new Set();

  underlines.forEach((el) => {
    const trigger = el.closest(TRIGGER_SELECTOR);
    if (!trigger || processed.has(trigger)) return;
    processed.add(trigger);
    bindTrigger(trigger);
  });
}

initTextUnderline();
