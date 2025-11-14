/**
 * selectの初期値文字色を制御
 * .p-form.scssで--placeholder-colorを設定し、その値を取得して設定
 */
document.addEventListener('DOMContentLoaded', function() {
  // .p-form要素からCSS変数を取得
  const formElement = document.querySelector('.p-form');
  if (!formElement) return;
  
  const placeholderColor = getComputedStyle(formElement).getPropertyValue('--placeholder-color').trim();
  
  document.querySelectorAll('select').forEach(function(select) {
    // 初期状態のチェック
    if (select.value === "") {
      select.style.color = placeholderColor;
    }
    
    select.addEventListener('change', function() {
      if (this.value === "") {
        this.style.color = placeholderColor;
      } else {
        this.style.color = "";
      }
    });
  });
});