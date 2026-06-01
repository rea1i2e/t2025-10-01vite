/**
 * スポットライト型スライダー（1スライド = 主画像 + テキスト、右に次2件プレビュー）
 */

import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";

const mainElement = document.getElementById("js-splide-spotlight-main");
const previewsElement = document.getElementById("js-splide-spotlight-previews");

if (mainElement && previewsElement) {
  const main = new Splide(mainElement, {
    type: "fade",
    rewind: true,
    pagination: false,
    arrows: true,
    speed: 600,
  });

  const getSlideSources = () => {
    const slides = mainElement.querySelectorAll(".splide__slide");
    return Array.from(slides).map((slide) => {
      const img = slide.querySelector(".p-splide-spotlight__media img");
      return {
        src: img?.getAttribute("src") ?? "",
        alt: img?.getAttribute("alt") ?? "",
      };
    });
  };

  const renderPreviews = (index) => {
    const sources = getSlideSources();
    const count = sources.length;
    if (count === 0) return;

    previewsElement.replaceChildren();

    [1, 2].forEach((offset) => {
      const targetIndex = (index + offset) % count;
      const { src, alt } = sources[targetIndex];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "p-splide-spotlight__preview";
      button.setAttribute("aria-label", `スライド${targetIndex + 1}を表示`);

      const previewImg = document.createElement("img");
      previewImg.src = src;
      previewImg.alt = alt;
      previewImg.width = 200;
      previewImg.height = 280;
      previewImg.loading = "lazy";
      previewImg.decoding = "async";

      button.append(previewImg);
      button.addEventListener("click", () => {
        main.go(targetIndex);
      });
      previewsElement.append(button);
    });
  };

  main.on("mounted move", () => {
    renderPreviews(main.index);
  });

  main.mount();
}
