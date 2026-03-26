/**
 * dialog要素を使用したモーダルウィンドウの実装
 * @see https://www.tak-dcxi.com/article/implementation-example-of-a-modal-created-using-the-dialog-element#%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B%E8%A6%81%E7%B4%A0%E3%81%AB%E3%81%AF-overscroll-behaviorcontain-%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%99%E3%2582%258B
 * カスタマイズ
 * ・デバッグ用の処理（1つ目のモーダル展開）
 * ・scrollbar-gutter: stable;を前提にしているため、paddingInlineEndを設定しない
 */

import {
  backfaceFixed,
  waitModalAnimation,
  manageEventListeners as manageCommonEventListeners
} from './_dialog-common.js';

const initializeModal = (modal) => {
  // モーダル要素が見つからない場合はエラーをログに記録して早期リターン
  if (!modal) {
    console.error("Element required for initializeModal is not found.");
    return;
  }

  // モーダルを開くトリガーと閉じるトリガーを取得
  const openTriggers = document.querySelectorAll(
    `[data-modal-open="${modal.id}"]`
  );
  const closeTriggers = modal.querySelectorAll("[data-modal-close]");

  // トリガーが見つからない場合はエラーをログに記録して早期リターン
  if (openTriggers.length === 0 || closeTriggers.length === 0) {
    console.error("Elements required for modal trigger are not found.");
    return;
  }

  // 開くトリガーにイベントリスナーを追加
  openTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleOpenTriggerClick(event, modal, trigger),
      false
    );
    trigger.addEventListener("mousedown", handleTriggerFocus, false);
    trigger.addEventListener("keydown", handleTriggerFocus, false);
  });

  // 閉じるトリガーにイベントリスナーを追加
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleCloseTriggerClick(event, modal),
      false
    );
  });
};

// イベントリスナーの管理（共通処理をラップ）
const manageEventListeners = (modal, add) => {
  const onClose = () => closeModal(modal);
  manageCommonEventListeners(modal, add, onClose);
};

let currentOpenTrigger = null;

// トリガーのクリックイベントハンドラ
const handleOpenTriggerClick = (event, modal, trigger) => {
  event.preventDefault();
  currentOpenTrigger = trigger;
  openModal(modal);
};

const handleCloseTriggerClick = (event, modal) => {
  event.preventDefault();
  closeModal(modal);
};

// トリガーのフォーカスイベントハンドラ
const handleTriggerFocus = (event) => {
  if (event.type === "mousedown") {
    document.documentElement.setAttribute("data-mousedown", "true");
  }
  if (event.type === "keydown") {
    document.documentElement.removeAttribute("data-mousedown");
  }
};

let isTransitioning = false;

// モーダルを開く
const openModal = (modal) => {
  if (isTransitioning) return;

  isTransitioning = true;
  modal.showModal();
  // modal.show();
  // モーダル内のスクロール位置をリセット（showModal()後のフォーカス移動でスクロール位置が変わってしまうのを防ぐ）
  // modal.scrollTop = 0;
  backfaceFixed(true);
  manageEventListeners(modal, true);

  requestAnimationFrame(async () => {
    modal.setAttribute("data-active", "true");
    await waitModalAnimation(modal);
    isTransitioning = false;
  });
};

// モーダルを閉じる
const closeModal = async (modal) => {
  if (isTransitioning) return;

  isTransitioning = true;
  modal.setAttribute("data-active", "false");
  manageEventListeners(modal, false);

  await waitModalAnimation(modal);
  backfaceFixed(false);
  modal.close();

  if (currentOpenTrigger) {
    currentOpenTrigger.focus();
    currentOpenTrigger = null;
  }

  isTransitioning = false;
};

const initDialog = () => {
  const targets = document.querySelectorAll(".js-dialog");

  targets?.forEach((target) => {
    initializeModal(target);
  });

  // // デバッグ用：1つ目のモーダルを自動的に開く
  // if (targets.length > 0) {
  //   openModal(targets[0]);
  // }
};

// type="module"のスクリプトはDOMContentLoadedの後に実行されるため、単純に呼び出すだけで良い
initDialog();