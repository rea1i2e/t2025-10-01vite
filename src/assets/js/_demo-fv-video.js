/**
 * デモページ: ファーストビュー動画（PC/SP の src 切替・音声トグル）
 * 対象: [data-demo-fv-video]
 */
const root = document.querySelector("[data-demo-fv-video]");
if (root) {
  const video = root.querySelector("video");
  const btn = root.querySelector(".p-demo-fv-video__sound");

  if (video && btn) {
    const pcSrc = video.dataset.pcSrc;
    const spSrc = video.dataset.spSrc;
    /** 768px 以上で PC 用動画 */
    const mq = window.matchMedia("(min-width: 768px)");
    /** 現在セット済みの URL（同一ブレークポイント内の再実行を防ぐ） */
    let appliedSrc = null;

    /** ボタン文言・ARIA を video.muted に合わせる（状態表示） */
    function syncButtonUi() {
      const soundOn = !video.muted;
      btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
      btn.textContent = soundOn ? "音声ON" : "音声OFF";
      btn.setAttribute(
        "aria-label",
        soundOn ? "動画の音声をオフにする" : "動画の音声をオンにする",
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

    btn.addEventListener("click", () => {
      if (video.muted) {
        // 音声 ON: 必ず先頭から
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        // 音声 OFF: ミュートのみ（再生位置は維持）
        video.muted = true;
      }
      syncButtonUi();
    });
  }
}
