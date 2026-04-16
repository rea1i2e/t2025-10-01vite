/**
 * インタビュー報告デモ — ランダム遷移と sessionStorage による「表示済み」管理
 *
 * - トップ: 「回答を見る」で 9 スラッグのいずれかへ遷移。
 * - 下層: 「同部の回答」「他の回答」で別スラッグへ。表示中ページは data-slug / data-dept で判別。
 * - sessionStorage に「一度表示したスラッグ」の一意リストを保存。抽選では原則ここに無い候補を優先し、
 *   候補が尽きたら visited を無視して再抽選（pickSlug）。
 * - トップページは訪問記録に含めない（下層ロード時のみ markVisited）。
 */

/** sessionStorage のキー。EJS の表示用ラベルと揃えること。 */
const STORAGE_KEY = "demoInterviewReportVisited";

/**
 * 全下層ページ。遷移先の決定にのみ使用（表示用 pageCode は HTML 側の include と一致させる）。
 * @type {Array<{ slug: string; dept: string }>}
 */
const PAGES = [
  // 本部 1-1 … 1-3
  { slug: "k59qj3iv", dept: "hq" },
  { slug: "q2g6cydv", dept: "hq" },
  { slug: "k62bfe8t", dept: "hq" },
  // 交際部 2-1 … 2-3
  { slug: "d4unw7t6", dept: "social" },
  { slug: "r7cs6mgi", dept: "social" },
  { slug: "n8ksfqv6", dept: "social" },
  // 強行部 3-1 … 3-3
  { slug: "y2kezf3c", dept: "force" },
  { slug: "m5ieujny", dept: "force" },
  { slug: "j3d9gren", dept: "force" },
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
 * EJS で置いた `[data-interview-storage-out]` に、現在の sessionStorage 内容を人が読める形で出す。
 * @param {HTMLElement} root `[data-interview-report-nav]` 要素（配下に out ノードがある想定）
 */
function updateStorageDisplay(root) {
  const out = root.querySelector("[data-interview-storage-out]");
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
 * 現在の URL から `demo-interview-report` ディレクトリ相当のベース URL（末尾 `/`）を得る。
 * 下層 URL が `…/demo-interview-report/d4unw7t6/` のとき、`new URL('./別slug/', location)` だと
 * `…/d4unw7t6/別slug/` と誤解決するため、常に `…/demo-interview-report/` を基準にする。
 */
function getInterviewReportBaseUrl() {
  const u = new URL(window.location.href);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.lastIndexOf("demo-interview-report");
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
  const base = getInterviewReportBaseUrl();
  const url = new URL(`./${slug}/`, base);
  window.location.assign(url.href);
}

/**
 * インタビュー報告ブロックがあれば初期化。他ページでは何もしない。
 * 下層のみ表示直後に markVisited → ストレージ表示更新 → ボタンクリックで遷移。
 */
function initInterviewReportNav() {
  const root = document.querySelector("[data-interview-report-nav]");
  if (!root) return;

  const nav = root.getAttribute("data-interview-report-nav");
  if (nav === "sub") {
    const slug = root.getAttribute("data-slug");
    if (slug) markVisited(slug);
  }

  updateStorageDisplay(root);

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-interview-action]");
    if (!btn || !root.contains(btn)) return;

    const action = btn.getAttribute("data-interview-action");
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

document.addEventListener("DOMContentLoaded", initInterviewReportNav);
