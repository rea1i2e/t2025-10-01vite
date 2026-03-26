/**
 * video要素動画再生モーダル（dialog要素を使用）
 * _dialog-general.jsと同じアプローチで、EJS側で生成されたdialog要素を初期化
 * 自動再生させない場合はtry, catch構文を削除
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

  // video要素を取得
  const videoPlayer = modal.querySelector('video');
  if (!videoPlayer) {
    console.error("Video element not found in modal.");
    return;
  }

  // 開くトリガーにイベントリスナーを追加
  openTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleOpenTriggerClick(event, modal, videoPlayer, trigger),
      false
    );
  });

  // 閉じるトリガーにイベントリスナーを追加
  closeTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      (event) => handleCloseTriggerClick(event, modal, videoPlayer),
      false
    );
  });
};

// イベントリスナーの管理（共通処理をラップ）
const manageEventListeners = (modal, videoPlayer, add) => {
  const onClose = () => closeModal(modal, videoPlayer);
  manageCommonEventListeners(modal, add, onClose);
};

let currentOpenTrigger = null;
let isTransitioning = false;

// トリガーのクリックイベントハンドラ
const handleOpenTriggerClick = (event, modal, videoPlayer, trigger) => {
  event.preventDefault();
  currentOpenTrigger = trigger;
  openModal(modal, videoPlayer);
};

const handleCloseTriggerClick = (event, modal, videoPlayer) => {
  event.preventDefault();
  closeModal(modal, videoPlayer);
};

// モーダルを開く
const openModal = (modal, videoPlayer) => {
  if (isTransitioning) return;

  isTransitioning = true;
  
  modal.showModal();
  backfaceFixed(true);
  manageEventListeners(modal, videoPlayer, true);

  requestAnimationFrame(async () => {
    modal.setAttribute("data-active", "true");
    await waitModalAnimation(modal);
    
    // アニメーション完了後に自動再生（mutedは設定しない）
    try {
      videoPlayer.autoplay = true;
      await videoPlayer.play();
    } catch (error) {
      // 自動再生がブロックされた場合（ブラウザのポリシーなど）
      console.warn("自動再生がブロックされました:", error);
    }
    
    isTransitioning = false;
  });
};

// モーダルを閉じる
const closeModal = async (modal, videoPlayer) => {
  if (isTransitioning) return;

  isTransitioning = true;
  modal.setAttribute("data-active", "false");
  manageEventListeners(modal, videoPlayer, false);

  await waitModalAnimation(modal);
  backfaceFixed(false);
  modal.close();

  // 動画を停止・リセット
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  }

  // フォーカスを戻す
  if (currentOpenTrigger) {
    currentOpenTrigger.focus();
    currentOpenTrigger = null;
  }

  isTransitioning = false;
};

const initDialogVideo = () => {
  const targets = document.querySelectorAll(".js-dialog-video");

  targets?.forEach((target) => {
    initializeModal(target);
  });
};

// type="module"のスクリプトはDOMContentLoadedの後に実行されるため、単純に呼び出すだけで良い
initDialogVideo();

