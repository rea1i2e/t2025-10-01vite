/**
 * スポットライト型スライダー（単一トラック・is-active のみ拡大＋テキスト表示）
 * li 幅は一定。アクティブ直後の非アクティブだけ margin-inline-start で広い分を確保。
 * Splide は refresh 時に marginRight へ gap を上書きするため、refresh 後に再設定する。
 */

import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

const splideSpotlightElement = document.getElementById("js-splide-spotlight");
const SPOTLIGHT_GAP = "calc(24 / 16 * 1rem)";

if (splideSpotlightElement) {
  const splide = new Splide(splideSpotlightElement, {
    type: "slide",
    rewind: false,
    autoWidth: true,
    focus: 0,
    gap: SPOTLIGHT_GAP,
    arrows: true,
    pagination: false,
    speed: 600,
  });

  const applySpotlightSlideMargins = () => {
    const styles = getComputedStyle(splideSpotlightElement);
    const slideWidth = styles
      .getPropertyValue("--splide-spotlight-slide-width")
      .trim();
    const activeWidth = styles
      .getPropertyValue("--splide-spotlight-active-width")
      .trim();
    const pushAfterActive = `calc(${activeWidth} - ${slideWidth})`;

    const slides = [
      ...splideSpotlightElement.querySelectorAll(
        ".p-splide-spotlight__item.splide__slide",
      ),
    ];

    slides.forEach((slide, index) => {
      const prev = slides[index - 1];
      slide.style.marginRight = SPOTLIGHT_GAP;
      slide.style.marginInlineStart = "";
      slide.style.marginInlineEnd = "";

      if (prev?.classList.contains("is-active")) {
        slide.style.marginInlineStart = pushAfterActive;
      }
    });
  };

  const refreshWithMargins = () => {
    splide.refresh();
    requestAnimationFrame(applySpotlightSlideMargins);
  };

  splide.on("mounted resized", refreshWithMargins);
  splide.on("moved", () => {
    requestAnimationFrame(refreshWithMargins);
  });

  splide.mount();
}
