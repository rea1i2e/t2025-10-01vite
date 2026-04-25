/**
 * デモ: SNS 共有リンクに表示中ページの URL / タイトルを差し込む
 */

const buildShareCurrentHref = (service, pageUrl, text) => {
  const t = text ?? '';
  const u = pageUrl;
  const paramsX = { url: u, text: t };
  const paramsFb = { u: u };
  const paramsLine = { url: u };
  const paramsLi = { url: u };

  switch (service) {
    case 'x':
      return `https://twitter.com/intent/tweet?${new URLSearchParams(paramsX).toString()}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams(
        paramsFb
      ).toString()}`;
    case 'line':
      return `https://social-plugins.line.me/lineit/share?${new URLSearchParams(
        paramsLine
      ).toString()}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams(
        paramsLi
      ).toString()}`;
    default:
      return '#';
  }
};

const run = () => {
  if (!document.querySelector('.p-demo-share')) {
    return;
  }

  const title = document.title;
  const hrefNow = window.location.href;

  document.querySelectorAll('a.js-ty-share-current[data-ty-share-service]').forEach((el) => {
    if (!(el instanceof HTMLAnchorElement)) {
      return;
    }
    const service = el.getAttribute('data-ty-share-service');
    if (!service) {
      return;
    }
    const override = el.getAttribute('data-ty-share-text');
    const text = override && override.length > 0 ? override : title;
    const next = buildShareCurrentHref(service, hrefNow, text);
    el.setAttribute('href', next);
    el.setAttribute('rel', 'noopener noreferrer');
    el.setAttribute('target', '_blank');
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run, { once: true });
} else {
  run();
}
