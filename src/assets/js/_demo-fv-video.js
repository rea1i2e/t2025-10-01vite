/**
 * デモページ: ファーストビュー動画（PC/SP の src 切替・ミュート／音声オンを別ボタン）
 * 対象: [data-demo-fv-video]
 */
const root = document.querySelector("[data-demo-fv-video]");
if (root) {
  const video = root.querySelector("video");
  const btnMute = root.querySelector(".p-demo-fv-video__sound-btn--mute");
  const btnUnmute = root.querySelector(".p-demo-fv-video__sound-btn--unmute");

  if (video && btnMute && btnUnmute) {
    const pcSrc = video.dataset.pcSrc;
    const spSrc = video.dataset.spSrc;
    /** 768px 以上で PC 用動画 */
    const mq = window.matchMedia("(min-width: 768px)");
    /** 現在セット済みの URL（同一ブレークポイント内の再実行を防ぐ） */
    let appliedSrc = null;

    /** 選択中の側は disabled + aria-pressed、反対側のみ操作可能 */
    function syncButtonUi() {
      const muted = video.muted;
      btnMute.setAttribute("aria-pressed", muted ? "true" : "false");
      btnUnmute.setAttribute("aria-pressed", muted ? "false" : "true");
      btnMute.disabled = muted;
      btnUnmute.disabled = !muted;
      btnMute.setAttribute(
        "aria-label",
        muted ? "ミュート中" : "動画をミュートにする",
      );
      btnUnmute.setAttribute(
        "aria-label",
        muted ? "動画の音声をオンにする" : "音声オン中",
      );
    }

    function desiredSrc() {
      return mq.matches ? pcSrc : spSrc;
    }

    /**
     * 動画 src を設定し、メタデータ取得後に先頭からミュート再生を試みる
     * @param {boolean} breakpointChanged 境界跨ぎ時はミュートに戻してから差し替え
     */
    function applySource(breakpointChanged) {
      const next = desiredSrc();
      if (!breakpointChanged && appliedSrc === next && video.src) {
        return;
      }
      appliedSrc = next;

      if (breakpointChanged) {
        // 仕様簡略化: リサイズ跨ぎでは常にミュートに戻す
        video.muted = true;
        syncButtonUi();
        video.pause();
      }

      video.src = next;
      video.load();

      const onLoadedMetadata = () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.currentTime = 0;
        if (breakpointChanged) {
          video.muted = true;
        }
        // 自動再生ポリシーで拒否されても未処理例外にしない
        video.play().catch(() => {});
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    }

    // 初期表示
    syncButtonUi();
    applySource(false);

    // メディアクエリ変化（768px 境界）でだけ src を差し替え
    mq.addEventListener("change", () => {
      applySource(true);
    });

    btnMute.addEventListener("click", () => {
      video.muted = true;
      syncButtonUi();
    });

    btnUnmute.addEventListener("click", () => {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(() => {});
      syncButtonUi();
    });
  }
}
