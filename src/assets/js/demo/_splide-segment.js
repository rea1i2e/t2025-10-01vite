/**
 * セグメント型インジケータ（横棒）＋ CSS 幅指定スライドの検証用
 * アクティブセグメントに 1 枚分の表示時間に同期した塗りアニメーション
 */

import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

const AUTOPLAY_INTERVAL_MS = 5000; // 正本：interval・CSS 変数。変更時は SCSS の var(..., フォールバック) も合わせる（JS 未実行対策）
const splideSegmentElement = document.getElementById("js-splide-segment");
if (splideSegmentElement) {
  splideSegmentElement.style.setProperty("--segment-duration", `${AUTOPLAY_INTERVAL_MS}ms`);

  const splideSegment = new Splide(splideSegmentElement, {
    type: "loop",
    rewind: true,
    speed: 600,
    gap: "calc(24 / 16 * 1rem)",
    arrows: true,
    pagination: true,
    autoWidth: true,
    autoplay: true,
    interval: AUTOPLAY_INTERVAL_MS,
    pauseOnHover: false,
    pauseOnFocus: false,
    resetProgress: false,
    classes: {
      pagination: "splide__pagination p-splide-segment__pagination",
      page: "splide__pagination__page p-splide-segment__page js-splide-segment-page",
    },
  });

  /* 見た目は p-splide-segment__page、DOM クエリは js-（ナレッジ coding-javascript / coding-ejs-html） */
  const pageSelector = ".js-splide-segment-page";
  const animateClass = "js-splide-segment-page-animate";

  const restartActiveSegmentFill = () => {
    const pages = splideSegment.root.querySelectorAll(pageSelector);
    pages.forEach((btn) => {
      btn.classList.remove(animateClass);
    });
    void splideSegment.root.offsetWidth;
    const active = splideSegment.root.querySelector(`${pageSelector}.is-active`);
    if (active) {
      active.classList.add(animateClass);
    }
  };

  /* move 直後はページネーションの is-active 更新が同フレームで済んでいないことがある */
  const restartActiveSegmentFillAfterMove = () => {
    requestAnimationFrame(() => {
      restartActiveSegmentFill();
    });
  };

  /* Autoplay は Splide 内部で move 発火時に interval を rewind するため、
   * 塗りも moved（遷移終了）ではなく move（遷移開始）でリセットする */
  splideSegment.on("mounted", restartActiveSegmentFill);
  splideSegment.on("move", restartActiveSegmentFillAfterMove);

  splideSegment.mount();
}
