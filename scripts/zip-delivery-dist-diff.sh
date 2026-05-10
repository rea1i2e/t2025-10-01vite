#!/usr/bin/env bash
# BASE_REF（既定 main）でビルドした dist と、現在の作業ツリーでビルドした dist を比較し、
# 作業側で「追加・変更」されたファイルだけを zip する（納品用）。
# 両方とも npm run build（vite build + scripts/after-build.mjs）で揃える。
#
# 使い方（リポジトリルート）:
#   OUT_DIR=/path/to/out ./scripts/zip-delivery-dist-diff.sh
#   BASE_REF=origin/main OUT_DIR=~/Downloads ./scripts/zip-delivery-dist-diff.sh
#
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BASE_REF="${BASE_REF:-main}"
OUT_DIR="${OUT_DIR:-}"

if [[ -z "$OUT_DIR" ]]; then
  echo "zip-delivery-dist-diff: 環境変数 OUT_DIR に zip の出力ディレクトリを指定してください。" >&2
  echo "例: OUT_DIR=\"\$HOME/Downloads\" ./scripts/zip-delivery-dist-diff.sh" >&2
  exit 1
fi

RESOLVED_REF="$(git rev-parse --verify "${BASE_REF}^{commit}" 2>/dev/null || true)"
if [[ -z "$RESOLVED_REF" ]]; then
  echo "zip-delivery-dist-diff: 参照 '${BASE_REF}' を解決できません。git fetch 後に再試行してください。" >&2
  exit 1
fi

STAMP="$(date +%Y-%m-%d_%H%M%S)"
mkdir -p "$OUT_DIR"
OUT_ZIP="${OUT_DIR}/dist-diff-${STAMP}.zip"

WT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/vite-delivery-baseline.XXXXXX")"
LIST=""

cleanup() {
  [[ -n "$LIST" && -f "$LIST" ]] && rm -f "$LIST"
  if [[ -n "${WT_DIR:-}" ]] && [[ -d "$WT_DIR" ]]; then
    git -C "$REPO_ROOT" worktree remove --force "$WT_DIR" 2>/dev/null || true
    rm -rf "$WT_DIR" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT HUP

echo "==> baseline: git worktree (${BASE_REF} → ${RESOLVED_REF:0:7}) at ${WT_DIR}"
git worktree add --detach "$WT_DIR" "$RESOLVED_REF"

echo "==> baseline: npm install & build (npm run build)"
if [[ -f "$WT_DIR/package-lock.json" ]]; then
  (cd "$WT_DIR" && npm ci)
else
  (cd "$WT_DIR" && npm install)
fi
(cd "$WT_DIR" && npm run build)

BASE_DIST="${WT_DIR}/dist"
if [[ ! -d "$BASE_DIST" ]]; then
  echo "zip-delivery-dist-diff: baseline に dist/ がありません: $BASE_DIST" >&2
  exit 1
fi

echo "==> working tree: npm run build @ ${REPO_ROOT}"
(cd "$REPO_ROOT" && npm run build)

WORK_DIST="${REPO_ROOT}/dist"
if [[ ! -d "$WORK_DIST" ]]; then
  echo "zip-delivery-dist-diff: 作業側に dist/ がありません: $WORK_DIST" >&2
  exit 1
fi

list_relpaths_to_zip() {
  local base_root="$1"
  local work_root="$2"
  local work_abs base_abs
  work_abs="$(cd "$work_root" && pwd)"
  base_abs="$(cd "$base_root" && pwd)"

  while IFS= read -r -d '' f; do
    rel="${f#"${work_abs}"/}"
    [[ -n "$rel" ]] || continue
    other="${base_abs}/${rel}"
    if [[ ! -f "$other" ]] || ! cmp -s "$f" "$other"; then
      printf '%s\n' "$rel"
    fi
  done < <(find "$work_abs" -type f -print0)
}

LIST="$(mktemp "${TMPDIR:-/tmp}/vite-delivery-zip-list.XXXXXX")"
list_relpaths_to_zip "$BASE_DIST" "$WORK_DIST" >"$LIST"

if [[ ! -s "$LIST" ]]; then
  echo "zip-delivery-dist-diff: dist に差分がありません（zip を作りません）。" >&2
  exit 1
fi

COUNT="$(grep -c '^' "$LIST" || true)"
echo "==> zip (${COUNT} files) → ${OUT_ZIP}"
(cd "$WORK_DIST" && zip -r "$OUT_ZIP" -@ <"$LIST")

echo "$OUT_ZIP"
