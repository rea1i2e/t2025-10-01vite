/**
 * selectの初期値文字色を制御
 * .p-form.scssで--placeholder-colorを設定し、その値を取得して設定
 * テーマ切替時も追従する
 */
const initOptionColor = () => {
  const formElement = document.querySelector('.p-form');
  if (!formElement) return;

  const applyOptionColors = () => {
    const placeholderColor = getComputedStyle(formElement)
      .getPropertyValue('--placeholder-color')
      .trim();

    document.querySelectorAll('select').forEach((select) => {
      if (select.value === '') {
        select.style.color = placeholderColor;
      } else {
        select.style.color = '';
      }
    });
  };

  document.querySelectorAll('select').forEach((select) => {
    select.addEventListener('change', applyOptionColors);
  });

  applyOptionColors();

  new MutationObserver(applyOptionColors).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
};

// type="module"のスクリプトはDOMContentLoadedの後に実行されるため、単純に呼び出すだけで良い
initOptionColor();
