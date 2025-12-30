/**
 * YouTube動画再生モーダル
 * .p-movie-modal クラスを持つ要素をクリックすると、data-video-id 属性から動画IDを取得してモーダルを開く
 */

document.addEventListener("DOMContentLoaded", () => {
  // p-movie-modalのclass名がつく要素を全取得
  document.querySelectorAll(".p-movie-modal").forEach((imgTag) => {
    imgTag.addEventListener("click", function () {
      openModal(imgTag.getAttribute("data-video-id"));
    });
  });

  // モーダルの要素を作成
  let modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "p-movie-modal__modal";

  // モーダルの要素をクリックしたら、モーダルを閉じる
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // p-movie-modal__modal-contentの要素を作成
  let modalContent = document.createElement("div");
  modalContent.className = "p-movie-modal__modal-content";

  // iframeのYouTube要素を作成
  let videoPlayer = document.createElement("iframe");
  videoPlayer.id = "videoPlayer";
  videoPlayer.width = "560";
  videoPlayer.height = "315";
  videoPlayer.frameBorder = "0";
  videoPlayer.allow =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  videoPlayer.setAttribute("allowfullscreen", "");

  // 閉じるボタンを作成
  let closeBtn = document.createElement("button");
  closeBtn.className = "p-movie-modal__close";
  closeBtn.setAttribute("aria-label", "モーダルを閉じる");
  closeBtn.addEventListener("click", closeModal);

  // モーダルの要素を追加
  modalContent.appendChild(videoPlayer);
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
});

// モーダル関数
function openModal(videoId) {
  let modal = document.getElementById("modal");
  let videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  videoPlayer.src =
    "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";

  modal.style.display = "flex";
  modal.style.animation = "fadeIn 0.3s forwards";
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

// モーダルを閉じる関数を作成
function closeModal() {
  let modal = document.getElementById("modal");
  let videoPlayer = document.getElementById("videoPlayer");

  if (!modal || !videoPlayer) return;

  modal.style.animation = "fadeout 0.3s forwards";

  setTimeout(() => {
    videoPlayer.src = "";
    modal.style.display = "none";
  }, 300);

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

