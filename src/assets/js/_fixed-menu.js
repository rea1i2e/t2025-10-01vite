/**
 * 固定メニューの表示制御
 * IntersectionObserver APIを使用して、特定のトリガー要素がビューポートに入っているかを監視し、
 * 一定位置を通過したら固定メニューを表示します。
 */
document.addEventListener('DOMContentLoaded', () => {
  const fixedMenu = document.getElementById('js-fixed-menu');
  const trigger = document.getElementById('js-fixed-menu-trigger');

  if (!fixedMenu || !trigger) return;

  let passed = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        passed = true;
      }

      if (!entry.isIntersecting && passed) {
        fixedMenu.classList.add('is-show');
      } else {
        fixedMenu.classList.remove('is-show');
      }
    });
  });

  observer.observe(trigger);
});

