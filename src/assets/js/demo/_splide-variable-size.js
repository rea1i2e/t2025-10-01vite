/**
 * 可変サイズスライダー（1スライド = 1列）
 * autoWidth + data-size="large" で幅2倍。細い列は __stack で画像2枚縦積み。幅・段組は CSS のみ。
 */

import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

const splideVariableSizeElement = document.getElementById("js-splide-variable-size");
if (splideVariableSizeElement) {
  const gap =
    getComputedStyle(splideVariableSizeElement)
      .getPropertyValue("--splide-variable-size-gap")
      .trim() || "calc(24 / 16 * 1rem)";

  new Splide(splideVariableSizeElement, {
    type: "loop",
    autoplay: true,
    autoWidth: true,
    perMove: 1,
    gap,
    arrows: true,
    pagination: true,
    speed: 600,
    focus: "center",
  }).mount();
}
