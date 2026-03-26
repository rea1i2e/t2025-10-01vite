/**
 * 汎用パララックス（スクロールに連動した視差効果）
 * data-parallax でトリガー兼移動量（%）を指定。値なしはデフォルト 30。
 * [data-parallax] 内の img 要素をスクロールに応じて移動する。GSAP ScrollTrigger 使用。
 *
 * 使い方:
 * 1. img の親要素の高さを指定する（aspect-ratio や height など）
 * 2. 親要素にカスタムデータ属性 data-parallax を付与する
 * 3. 移動量に応じて data-parallax="10" のように % の数値を指定する（指定しない場合デフォルトの 30% となる）
 * 4. 親要素の高さ＋移動量のサイズになる画像を、親要素の直下に img 1枚設置する（例: 親の高さ 100px・移動量 30% なら 高さ 130px の画像）
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARALLAX_SELECTOR = '[data-parallax]';
/** デフォルトの移動量（%） */
const DEFAULT_PARALLAX_PERCENT = 30;
/** 画像の余白（移動量に応じて可変、この値以上を確保） */
const MIN_EXTRA_HEIGHT_PERCENT = 20;

const initParallax = () => {
  const wrappers = document.querySelectorAll(PARALLAX_SELECTOR);
  if (wrappers.length === 0) return;

  wrappers.forEach((wrapper) => {
    const img = wrapper.tagName === 'IMG' ? wrapper : wrapper.querySelector('img');
    if (!img) return;

    const amountAttr = wrapper.getAttribute('data-parallax');
    const amount = amountAttr !== null && amountAttr !== ''
      ? parseFloat(amountAttr, 10)
      : DEFAULT_PARALLAX_PERCENT;
    const value = Number.isFinite(amount) ? amount : DEFAULT_PARALLAX_PERCENT;
    const extraHeight = Math.max(MIN_EXTRA_HEIGHT_PERCENT, Math.abs(value));

    // 指定値は「親に対する移動量%」。transform の % は img 自身の高さ基準なので換算する。
    // 親の M% 分だけ動かすには transform を 100*M/(100+M)% にすれば余白が出ない。
    const transformPercent = (100 * Math.abs(value)) / (100 + Math.abs(value));
    // 正: 開始を上ずらし→0 で下に移動。負: 開始0→終了で上ずらし（下部余白を防ぐ）
    const fromY = value >= 0 ? -transformPercent : 0;
    const toY = value >= 0 ? 0 : -transformPercent;

    wrapper.style.overflow = 'hidden';
    img.style.height = `calc(100% + ${extraHeight}%)`;
    img.style.objectFit = 'cover';

    gsap.fromTo(
      img,
      { y: `${fromY}%` },
      {
        y: `${toY}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
};

initParallax();
