/**
 * YouTube動画再生モーダル（dialog要素を使用）
 * data-modal-open="youtube-modal" 属性を持つ要素をクリックすると、data-video-id 属性から動画IDを取得してモーダルを開く
 * 自動再生させない場合は、allow属性の autoplay を削除
 */

import {
  backfaceFixed,
  waitModalAnimation,
  manageEventListeners
} from './_dialog-common.js';

let modal = null;
let videoPlayer = null;
let closeBtn = null;
let currentOpenTrigger = null;
let isTransitioning = false;

// モーダルを開く
const openModal = (videoId, trigger) => {
  if (isTransitioning) return;
  if (!modal || !videoPlayer) return;

  isTransitioning = true;
  currentOpenTrigger = trigger;

  // YouTube動画のURLを設定
  videoPlayer.src =
    "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";

  modal.showModal();
  backfaceFixed(true);
  manageEventListeners(modal, true, () => closeModal());

  requestAnimationFrame(async () => {
    modal.setAttribute("data-active", "true");
    await waitModalAnimation(modal);
    isTransitioning = false;
  });
};

// モーダルを閉じる
const closeModal = async () => {
  if (isTransitioning) return;
  if (!modal || !videoPlayer) return;

  isTransitioning = true;
  modal.setAttribute("data-active", "false");
  manageEventListeners(modal, false, () => {});

  await waitModalAnimation(modal);
  backfaceFixed(false);
  modal.close();

  // 動画を停止
  videoPlayer.src = "";

  // フォーカスを戻す
  if (currentOpenTrigger) {
    currentOpenTrigger.focus();
    currentOpenTrigger = null;
  }

  isTransitioning = false;
};

// 初期化
const initDialogYoutube = () => {
  // dialog要素を作成
  modal = document.createElement("dialog");
  modal.id = "youtube-modal";
  modal.className = "p-dialog p-dialog--youtube js-dialog-movie";

  // モーダルコンテンツの要素を作成
  const modalContent = document.createElement("div");
  modalContent.className = "p-dialog__movie-content";

  // iframeのYouTube要素を作成
  videoPlayer = document.createElement("iframe");
  videoPlayer.id = "videoPlayer";
  videoPlayer.width = "560";
  videoPlayer.height = "315";
  videoPlayer.frameBorder = "0";
  videoPlayer.allow =
    // "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  videoPlayer.setAttribute("allowfullscreen", "");

  // 閉じるボタンを作成
  closeBtn = document.createElement("button");
  closeBtn.className = "p-dialog__close p-dialog__close--movie";
  closeBtn.setAttribute("aria-label", "モーダルを閉じる");
  closeBtn.setAttribute("data-modal-close", "");
  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });

  // モーダルの要素を組み立て
  modalContent.appendChild(videoPlayer);
  modal.appendChild(modalContent);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);

  // data-modal-open="youtube-modal" 属性を持つ要素を全取得
  document.querySelectorAll('[data-modal-open="youtube-modal"]').forEach((trigger) => {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      const videoId = trigger.getAttribute("data-video-id");
      if (videoId) {
        openModal(videoId, trigger);
      }
    });
  });
};

// type="module"のスクリプトはDOMContentLoadedの後に実行されるため、単純に呼び出すだけで良い
initDialogYoutube();

