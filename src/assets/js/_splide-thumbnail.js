/**
 * サムネイル付きスライダー
 * メインスライダーとサムネイルスライダーを同期
 * @see https://splidejs.com/tutorials/thumbnail-carousel/
 */

import "@splidejs/splide/dist/css/splide-core.min.css";
import { Splide } from "@splidejs/splide";


const mainElement = document.getElementById("js-splide-thumbnail-main");
const thumbnailsElement = document.getElementById("js-splide-thumbnail-nav");

if (mainElement && thumbnailsElement) {
  const main = new Splide(mainElement, {
    type: "fade",
    pagination: false,
    arrows: false,
  });
  
  const thumbnails = new Splide(thumbnailsElement, {
    rewind: true,
    autoWidth: true,
    isNavigation: true,
    gap: 10,
    focus: "center",
    pagination: false,
    arrows: false,
  });

  main.sync(thumbnails);
  main.mount();
  thumbnails.mount();
}


