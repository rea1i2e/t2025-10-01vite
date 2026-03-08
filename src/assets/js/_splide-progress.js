import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

/**
 * プログレスバー付きスライダー
 * スライド位置に応じてプログレスバーの幅を更新
 */

const splideProgressElement = document.getElementById("js-splide-progress");
if (splideProgressElement) {
  const splideProgress = new Splide(splideProgressElement, {
    speed: 1000,
    interval: 5000,
    pagination: false,
    autoWidth: true,
    gap: "calc(32 / 16 * 1rem)",
    breakpoints: {
      768: {
        gap: "calc(24 / 16 * 1rem)",
      },
    },
  });

  const bar = splideProgress.root.querySelector(".js-splide-progress-bar");
  if (bar) {
    splideProgress.on("mounted move", function () {
      const end = splideProgress.Components.Controller.getEnd() + 1;
      const rate = Math.min((splideProgress.index + 1) / end, 1);
      bar.style.width = String(100 * rate) + "%";
    });
  }

  splideProgress.mount();
}
