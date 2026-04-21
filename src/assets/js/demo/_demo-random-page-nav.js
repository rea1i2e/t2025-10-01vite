/**
 * ランダムページ遷移（訪問済み除外）デモ — sessionStorage による「表示済み」管理とランダム遷移
 *
 * 【処理の流れ（このファイルの正本）】
 * 1. 定数配列 PAGES で下層ページ一覧（slug / dept）を定義する。
 * 2. sessionStorage に「一度表示したスラッグ」の配列を保存する（STORAGE_KEY）。トップは記録しない。
 * 3. 下層ロード時のみ markVisited で現在スラッグを追加（重複なし）。
 * 4. [data-random-page-nav] への click 委譲で data-random-page-nav-action に応じ resolveNextSlug。
 *    - random: 全 slug → pickSlug
 *    - same-dept: 同一 dept かつ currentSlug 以外 → pickSlug
 *    - other: currentSlug 以外の全 slug → pickSlug
 * 5. pickSlug は「候補のうち未訪問が 1 つでもあれば未訪問だけから乱数」「未訪問が空なら候補全体に戻して乱数」。
 *    「全件訪問済みだから表示中だけ除外」のような分岐はない。random では同一スラッグへの再遷移もあり得る。
 * 6. navigateToSlug: getRandomPageNavBaseUrl で demo-random-page-nav までを基準にし、
 *    new URL('./{slug}/', base) を解決して window.location.assign(url.href) で遷移。
 *
 * UI 上の対応: トップは「ページを見る」、下層は「同グループのページ」「他のページ」。表示中は data-slug / data-dept。
 */

/** sessionStorage のキー。EJS の表示用ラベルと揃えること。 */
const STORAGE_KEY = "demoRandomPageNavVisited";

/**
 * 全下層ページ。遷移先の決定にのみ使用（表示用 pageCode は HTML 側の include と一致させる）。
 * @type {Array<{ slug: string; dept: string }>}
 */
const PAGES = [
  // デモ用連番スラッグ。dept は d1〜d3 のグループキー。
  { slug: "page-01", dept: "d1" },
  { slug: "page-02", dept: "d1" },
  { slug: "page-03", dept: "d1" },
  { slug: "page-04", dept: "d2" },
  { slug: "page-05", dept: "d2" },
  { slug: "page-06", dept: "d2" },
  { slug: "page-07", dept: "d3" },
  { slug: "page-08", dept: "d3" },
  { slug: "page-09", dept: "d3" },
];

/** 保存済みの「表示済みスラッグ」配列を読む。不正 JSON や型不正時は空配列。 */
function loadVisited() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** 表示済みスラッグ一覧を JSON 文字列で保存。 */
function saveVisited(slugs) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

/**
 * 下層を開いたタイミングで呼ぶ。同一スラッグは重複して push しない（配列の最大長はページ数まで）。
 * @param {string} slug
 */
function markVisited(slug) {
  const v = loadVisited();
  if (!v.includes(slug)) {
    v.push(slug);
    saveVisited(v);
  }
}

/**
 * デバッグ用関数
 * EJS で置いた `[data-random-page-nav-storage-out]` に、現在の sessionStorage 内容を人が読める形で出す。
 * @param {HTMLElement} root `[data-random-page-nav]` 要素（配下に out ノードがある想定）
 */
function updateStorageDisplay(root) {
  const out = root.querySelector("[data-random-page-nav-storage-out]");
  if (!out) return;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw == null || raw === "") {
    out.textContent = "（未設定）";
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    out.textContent = JSON.stringify(parsed, null, 2);
  } catch {
    out.textContent = `（JSON として解釈できません）\n${raw}`;
  }
}

/**
 * 候補の中から次のスラッグを 1 つ選ぶ。
 * まず「visited にまだ無い」候補だけを使い、それが空なら候補全体に戻す（仕様: 該当が他にないときは再表示あり）。
 * @param {string[]} candidates スラッグ候補（重複なし想定）
 * @returns {string|null}
 */
function pickSlug(candidates) {
  if (candidates.length === 0) return null;
  const visited = loadVisited();
  const unvisited = candidates.filter((s) => !visited.includes(s));
  const pool = unvisited.length > 0 ? unvisited : candidates;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

/**
 * ボタン種別に応じて候補集合を作り、pickSlug に渡す。
 * - random: 全スラッグ（トップ用）
 * - same-dept: 現在と同じ dept かつ自分以外
 * - other: 自分以外の全スラッグ
 * @param {{ mode: 'random' | 'same-dept' | 'other'; currentSlug?: string; dept?: string }} opts
 * @returns {string|null}
 */
function resolveNextSlug(opts) {
  const { mode, currentSlug = "", dept = "" } = opts;

  if (mode === "random") {
    const all = PAGES.map((p) => p.slug);
    return pickSlug(all);
  }

  if (mode === "same-dept") {
    const same = PAGES.filter(
      (p) => p.dept === dept && p.slug !== currentSlug,
    ).map((p) => p.slug);
    return pickSlug(same);
  }

  if (mode === "other") {
    const others = PAGES.filter((p) => p.slug !== currentSlug).map((p) => p.slug);
    return pickSlug(others);
  }

  return null;
}

/**
 * 現在の URL から `demo-random-page-nav` ディレクトリ相当のベース URL（末尾 `/`）を得る。
 * 下層 URL が `…/demo-random-page-nav/page-01/` のとき、`new URL('./別slug/', location)` だと
 * `…/page-01/別slug/` と誤解決するため、常に `…/demo-random-page-nav/` を基準にする。
 */
function getRandomPageNavBaseUrl() {
  const u = new URL(window.location.href);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.lastIndexOf("demo-random-page-nav");
  if (idx !== -1) {
    u.pathname = `/${parts.slice(0, idx + 1).join("/")}/`;
    u.search = "";
    u.hash = "";
    return u;
  }
  return new URL("./", window.location.href);
}

/** デモルート基準で `./{slug}/` に遷移する。 */
function navigateToSlug(slug) {
  const base = getRandomPageNavBaseUrl();
  const url = new URL(`./${slug}/`, base);
  window.location.assign(url.href);
}

/**
 * ランダムページ遷移デモブロックがあれば初期化。他ページでは何もしない。
 * 下層のみ表示直後に markVisited → ストレージ表示更新 → root へのイベント委譲で遷移。
 */
function initRandomPageNav() {
  const root = document.querySelector("[data-random-page-nav]");
  if (!root) return;

  const nav = root.getAttribute("data-random-page-nav");
  if (nav === "sub") {
    const slug = root.getAttribute("data-slug");
    if (slug) markVisited(slug);
  }

  // デバッグ用の表示更新
  updateStorageDisplay(root);

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-random-page-nav-action]");
    if (!btn || !root.contains(btn)) return;

    const action = btn.getAttribute("data-random-page-nav-action");
    const currentSlug = root.getAttribute("data-slug") || "";
    const deptAttr = root.getAttribute("data-dept") || "";

    let next = null;
    if (action === "random") {
      next = resolveNextSlug({ mode: "random" });
    } else if (action === "same-dept") {
      next = resolveNextSlug({
        mode: "same-dept",
        currentSlug,
        dept: deptAttr,
      });
    } else if (action === "other") {
      next = resolveNextSlug({ mode: "other", currentSlug });
    }

    if (next) navigateToSlug(next);
  });
}

document.addEventListener("DOMContentLoaded", initRandomPageNav);
