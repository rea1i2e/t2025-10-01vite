/**
 * dialog要素の共通処理
 * スクロールロック、イベント管理、アニメーション管理などの共通機能を提供
 */

// ドキュメントの書字方向を取得し、縦書きかどうかを判定
const isVerticalWritingMode = () => {
  const writingMode = window.getComputedStyle(document.documentElement)
    .writingMode;
  return writingMode.includes("vertical");
};

// スクロール位置を取得する
const getScrollPosition = (fixed) => {
  if (fixed) {
    return isVerticalWritingMode()
      ? document.scrollingElement?.scrollLeft ?? 0
      : document.scrollingElement?.scrollTop ?? 0;
  }
  return parseInt(document.body.style.insetBlockStart || "0", 10);
};

const applyStyles = (scrollPosition, apply) => {
  const styles = {
    blockSize: "100dvb",
    insetInlineStart: "0",
    position: "fixed",
    insetBlockStart: isVerticalWritingMode()
      ? `${scrollPosition}px`
      : `${scrollPosition * -1}px`,
    // inlineSize: "100dvi"
    inlineSize: "100%"
  };
  Object.keys(styles).forEach((key) => {
    const styleKey = key;
    document.body.style[styleKey] = apply ? styles[styleKey] : "";
  });
};

// スクロール位置を元に戻す
const restorePosition = (scrollPosition) => {
  const options = {
    behavior: "instant",
    [isVerticalWritingMode() ? "left" : "top"]: isVerticalWritingMode()
      ? scrollPosition
      : scrollPosition * -1
  };
  window.scrollTo(options);
};

// 背面を固定する
export const backfaceFixed = (fixed) => {
  const scrollPosition = getScrollPosition(fixed);
  applyStyles(scrollPosition, fixed);
  if (!fixed) {
    restorePosition(scrollPosition);
  }
};

// モーダルのアニメーションが完了するのを待つ
export const waitModalAnimation = (modal) => {
  if (modal.getAnimations().length === 0) return Promise.resolve([]);
  return Promise.allSettled(
    [...modal.getAnimations()].map((animation) => animation.finished)
  );
};

const eventListenersMap = new Map();

// イベントリスナーの管理
export const manageEventListeners = (modal, add, onClose) => {
  const backdropClickListener = (event) => {
    if (event.target === modal) {
      onClose();
    }
  };
  const keyDownListener = (event) => {
    document.documentElement.removeAttribute("data-mousedown");
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  if (add) {
    // イベントリスナーを追加
    modal.addEventListener("click", backdropClickListener, false);
    window.addEventListener("keydown", keyDownListener, false);
    eventListenersMap.set(modal, { backdropClickListener, keyDownListener });
  } else {
    // イベントリスナーを削除
    const listeners = eventListenersMap.get(modal);
    if (listeners) {
      modal.removeEventListener("click", listeners.backdropClickListener);
      window.removeEventListener("keydown", listeners.keyDownListener);
      eventListenersMap.delete(modal);
    }
  }
};


