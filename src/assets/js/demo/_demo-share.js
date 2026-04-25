/**
 * デモ: SNS 共有リンクに表示中ページの URL / タイトルを差し込む
 */

const decodeShareStaticText = (encoded) => {
  if (!encoded || String(encoded).trim() === "") {
    return "";
  }
  try {
    return decodeURIComponent(encoded);
  } catch {
    return "";
  }
};

const buildShareCurrentHref = (service, pageUrl, textBody, intentUrls) => {
  const fullText = `${textBody}\n${pageUrl}`;
  const paramsX = { text: fullText };
  const paramsFacebook = { u: pageUrl };
  switch (service) {
    case "x":
      return `${intentUrls.x}?${new URLSearchParams(paramsX).toString()}`;
    case "facebook":
      return `${intentUrls.facebook}?${new URLSearchParams(paramsFacebook).toString()}`;
    case "line":
      return `${intentUrls.line}${encodeURIComponent(fullText)}`;
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
  };
  const shareStaticBody = decodeShareStaticText(rootElement.dataset.tyShareStaticText ?? "");
  if (!intentUrls.x || !intentUrls.facebook || !intentUrls.line) {
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
    const textBody =
      override && override.length > 0
        ? override
        : shareStaticBody && shareStaticBody.trim() !== ""
          ? shareStaticBody
          : title;
    const next = buildShareCurrentHref(service, hrefNow, textBody, intentUrls);
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
