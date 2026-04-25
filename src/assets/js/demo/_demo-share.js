/**
 * デモ: SNS 共有リンクに表示中ページの URL を差し込む。
 * EJS の `data-share-static-text`（`encodeURIComponent` 済み本文）を復元し、X / LINE では末尾に `location.href` を付与する。
 */

/**
 * `data-share-static-text` 用の文字列をデコードする。空・不正なら空文字。
 * @param {string} encoded - `encodeURIComponent` 済みの本文（URL は含まない想定）
 * @returns {string}
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

/**
 * サービス別の共有 `href` を組み立てる。
 * X / LINE: `textBody + "\n" + pageUrl`（URL は末尾）。Facebook: `u` に `pageUrl` のみ。
 * @param {"x" | "facebook" | "line" | string} service - `data-share-service` の値
 * @param {string} pageUrl - 通常 `location.href`
 * @param {string} textBody - 先頭ブロック（`data-share-text` 優先、なければ復元本文、なければ `document.title`）
 * @param {{ x: string; facebook: string; line: string }} intentUrls - Intent ベース URL
 * @returns {string}
 */
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

/**
 * `[data-share-root]` 配下の `[data-share-service]` に、表示中 URL 込みの `href` を付与する。
 */
const run = () => {
  const rootElement = document.querySelector("[data-share-root]");
  if (!(rootElement instanceof HTMLElement)) {
    return;
  }

  const intentUrls = {
    x: rootElement.dataset.shareIntentX ?? "",
    facebook: rootElement.dataset.shareIntentFacebook ?? "",
    line: rootElement.dataset.shareIntentLine ?? "",
  };
  const shareStaticBody = decodeShareStaticText(rootElement.dataset.shareStaticText ?? "");
  if (!intentUrls.x || !intentUrls.facebook || !intentUrls.line) {
    return;
  }

  const title = document.title;
  const hrefNow = window.location.href;

  document.querySelectorAll("[data-share-service]").forEach((el) => {
    if (!(el instanceof HTMLAnchorElement)) {
      return;
    }
    const service = el.getAttribute("data-share-service");
    if (!service) {
      return;
    }
    const override = el.getAttribute("data-share-text");
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
