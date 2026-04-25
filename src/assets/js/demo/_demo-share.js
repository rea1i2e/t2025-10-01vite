/**
 * デモ: SNS 共有リンクに表示中ページの URL / タイトルを差し込む
 */

const buildShareCurrentHref = (service, pageUrl, text, intentUrls) => {
  const shareText = text ?? "";
  const paramsX = { url: pageUrl, text: shareText };
  const paramsFacebook = { u: pageUrl };
  const paramsLine = { url: pageUrl };
  const paramsLinkedin = { url: pageUrl };

  switch (service) {
    case "x":
      return `${intentUrls.x}?${new URLSearchParams(paramsX).toString()}`;
    case "facebook":
      return `${intentUrls.facebook}?${new URLSearchParams(paramsFacebook).toString()}`;
    case "line":
      return `${intentUrls.line}?${new URLSearchParams(paramsLine).toString()}`;
    case "linkedin":
      return `${intentUrls.linkedin}?${new URLSearchParams(paramsLinkedin).toString()}`;
    default:
      return "#";
  }
};

const run = () => {
  const rootElement = document.querySelector("[data-ty-demo-share]");
  if (!(rootElement instanceof HTMLElement)) {
    return;
  }

  const intentUrls = {
    x: rootElement.dataset.tyShareIntentX ?? "",
    facebook: rootElement.dataset.tyShareIntentFacebook ?? "",
    line: rootElement.dataset.tyShareIntentLine ?? "",
    linkedin: rootElement.dataset.tyShareIntentLinkedin ?? "",
  };
  if (!intentUrls.x || !intentUrls.facebook || !intentUrls.line || !intentUrls.linkedin) {
    return;
  }

  const title = document.title;
  const hrefNow = window.location.href;

  document.querySelectorAll("a.js-ty-share-current[data-ty-share-service]").forEach((el) => {
    if (!(el instanceof HTMLAnchorElement)) {
      return;
    }
    const service = el.getAttribute("data-ty-share-service");
    if (!service) {
      return;
    }
    const override = el.getAttribute("data-ty-share-text");
    const text = override && override.length > 0 ? override : title;
    const next = buildShareCurrentHref(service, hrefNow, text, intentUrls);
    el.setAttribute("href", next);
    el.setAttribute("rel", "noopener noreferrer");
    el.setAttribute("target", "_blank");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}
