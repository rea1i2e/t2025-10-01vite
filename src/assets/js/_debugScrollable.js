/**
 * スクロールバーが出ている要素を調査するデバッグ用ユーティリティ（開発時のみ使用）
 * コンソールで debugScrollableReport() を実行すると一覧を表示する
 */

/**
 * overflow が auto/scroll かつ実際にスクロール可能な要素を再帰的に収集
 * @returns {{ element: Element, tag: string, id: string, className: string, overflow: string, scrollHeight: number, clientHeight: number, scrollWidth: number, clientWidth: number }[]}
 */
export function findScrollableElements() {
  const result = [];

  function walk(el) {
    if (el.nodeType !== Node.ELEMENT_NODE) return;

    const style = getComputedStyle(el);
    const ox = style.overflowX;
    const oy = style.overflowY;
    const canScrollY = (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
    const canScrollX = (ox === "auto" || ox === "scroll") && el.scrollWidth > el.clientWidth;

    if (canScrollY || canScrollX) {
      result.push({
        element: el,
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        className: (el.className && typeof el.className === "string" ? el.className : "") || "",
        overflow: `${ox} ${oy}`,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      });
    }

    for (const child of el.children) walk(child);
  }

  walk(document.body);
  return result;
}

/**
 * コンソールにスクロール可能要素の一覧を表示し、該当要素をハイライトする
 */
export function reportScrollableElements() {
  const list = findScrollableElements();

  if (list.length === 0) {
    console.log("スクロール可能な要素は見つかりませんでした。");
    return list;
  }

  console.log(`スクロール可能な要素: ${list.length} 件`);
  console.table(
    list.map(({ tag, id, className, overflow, scrollHeight, clientHeight, scrollWidth, clientWidth }) => ({
      タグ: tag,
      id: id || "—",
      クラス: className.slice(0, 40) + (className.length > 40 ? "…" : ""),
      overflow,
      "scrollHeight": scrollHeight,
      "clientHeight": clientHeight,
      "scrollWidth": scrollWidth,
      "clientWidth": clientWidth,
    }))
  );

  list.forEach((item, i) => {
    console.log(`[${i}]`, item.element);
    item.element.setAttribute("data-debug-scrollable", String(i));
  });

  return list;
}

/* 読み込み時に1回実行。再実行はコンソールで debugScrollableReport() */
reportScrollableElements();
window.debugScrollableReport = reportScrollableElements;
window.debugScrollable = findScrollableElements;
