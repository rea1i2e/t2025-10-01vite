import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

/**
 * 投稿一覧スライダー（テキスト量に応じて表示時間を可変）
 */

const splidePosts = document.getElementById("js-splide-posts");

const TEXT_SCROLL_SPEED_PX_PER_SEC = 80; // 1秒あたり80px移動
const TEXT_SCROLL_DELAY_MS = 2000; // 1秒後にスクロール開始
const TEXT_SCROLL_STAY_MS = 500; // スクロール停止時間
const SPLIDE_FADE_SPEED_MS = 2000; // スライドフェード速度
const SPLIDE_INTERVAL_FALLBACK_MS = 10000; // スライドインターバルフォールバック

const syncSlideTiming = (root, fadeSpeedMs) => {
  const slides = root.querySelectorAll(".p-splide-posts__item.splide__slide");

  slides.forEach((slide) => {
    const text = slide.querySelector(".p-splide-posts__item-text");
    if (!text) return;

    const textWidth = text.getBoundingClientRect().width;
    const durationMs = Math.max(
      1000,
      Math.round((textWidth / TEXT_SCROLL_SPEED_PX_PER_SEC) * 1000),
    );
    const intervalMs = TEXT_SCROLL_DELAY_MS + durationMs + TEXT_SCROLL_STAY_MS + fadeSpeedMs;
    // const intervalMs = TEXT_SCROLL_DELAY_MS + durationMs + TEXT_SCROLL_STAY_MS;

    text.style.setProperty("--text-scroll-duration", `${durationMs}ms`);
    text.style.setProperty("--text-scroll-delay", `${TEXT_SCROLL_DELAY_MS}ms`);
    slide.dataset.splideInterval = String(intervalMs);
  });
};

const getSlideInterval = (slide) => {
  const interval = Number(slide?.dataset.splideInterval);
  return Number.isFinite(interval) && interval > 0 ? interval : SPLIDE_INTERVAL_FALLBACK_MS;
};

if (splidePosts) {
  syncSlideTiming(splidePosts, SPLIDE_FADE_SPEED_MS);

  const firstSlide = splidePosts.querySelector(".p-splide-posts__item.splide__slide");
  const splide = new Splide(splidePosts, {
    type: "fade",
    rewind: true,
    autoplay: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false, // autoplay停止時、残り時間をリセットしない
    speed: SPLIDE_FADE_SPEED_MS,
    interval: getSlideInterval(firstSlide),
    perPage: 1,
    perMove: 1,
    gap: 0,
  });

  const updateCurrentInterval = () => {
    const currentSlide = splide.Components.Slides.getAt(splide.index)?.slide;
    splide.options = {
      interval: getSlideInterval(currentSlide),
    };
  };

  splide.on("mounted", updateCurrentInterval);
  splide.on("moved", updateCurrentInterval);
  splide.on("resized", () => {
    syncSlideTiming(splidePosts, SPLIDE_FADE_SPEED_MS);
    updateCurrentInterval();
  });

  splide.mount();
}
