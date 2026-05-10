#!/usr/bin/env bash
# BASE_REF（既定 main）でビルドした dist と、現在の作業ツリーでビルドした dist を比較し、
# 作業側で「追加・変更」されたファイルだけを zip する（納品用）。
# 両方とも npm run build（vite build + scripts/after-build.mjs）で揃える。
#
# Git の差分が src/**/*.html と src/public/** だけのとき（ナロー）は、
# それに対応する dist のみ＋その HTML が参照する assets/** のうち「実際に dist で差分があるもの」に限定する。
# それ以外の変更（Sass/JS/設定など）があるときはフル dist 差分（従来どおり）。
#
# MailForm01_utf8 は src/public が Git 差分に含まれない限り zip に含めない
# （main 側に mail.php が無いときの誤検知を防ぐ）。
#
# 使い方（リポジトリルート）:
#   ./scripts/zip-delivery-dist-diff.sh
#   OUT_DIR=/path/to/out ./scripts/zip-delivery-dist-diff.sh
#   BASE_REF=origin/main ./scripts/zip-delivery-dist-diff.sh
#   FORCE_WIDE=1 ./scripts/zip-delivery-dist-diff.sh   # 常にフル dist 差分
#   DELIVERY_ALLOW_DIRTY=1 ...  # 未コミットがあっても続行（非推奨）
#
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BASE_REF="${BASE_REF:-main}"
OUT_DIR="${OUT_DIR:-$(dirname "$REPO_ROOT")}"

if [[ "${DELIVERY_ALLOW_DIRTY:-}" != "1" ]] && [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "zip-delivery-dist-diff: 警告: 未コミットの変更があります（変更・ステージ・未追跡のいずれか）。納品 zip は作成せず中止します。コミットまたは不要な変更の破棄のうえで再実行してください。" >&2
  echo "zip-delivery-dist-diff: 意図的に続行する場合のみ DELIVERY_ALLOW_DIRTY=1 を付与してください（ナローモードで zip 漏れのリスクあり）。" >&2
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
AUX="$(mktemp -d "${TMPDIR:-/tmp}/vite-zip-aux.XXXXXX")"

cleanup() {
  rm -rf "${AUX:-}" 2>/dev/null || true
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

ALL="${AUX}/all.list"
GIT_NAMES="${AUX}/git-names.txt"
ZIPLIST="${AUX}/zip.list"
SEEDS="${AUX}/seeds.txt"
NARROW="${AUX}/narrow.list"
EXTRA="${AUX}/extra.list"

list_relpaths_to_zip "$BASE_DIST" "$WORK_DIST" | sort -u >"$ALL"

if [[ ! -s "$ALL" ]]; then
  echo "zip-delivery-dist-diff: dist に差分がありません（zip を作りません）。" >&2
  exit 1
fi

git diff --name-only "${BASE_REF}..HEAD" >"$GIT_NAMES" || true

is_wide=false
if [[ "${FORCE_WIDE:-}" == 1 ]]; then
  is_wide=true
elif [[ ! -s "$GIT_NAMES" ]]; then
  echo "zip-delivery-dist-diff: Git にコミット差分がありません（${BASE_REF}..HEAD）。フル dist 差分で zip します。" >&2
  is_wide=true
else
  while IFS= read -r p; do
    [[ -z "$p" ]] && continue
    if [[ "$p" == src/public/* ]]; then
      continue
    fi
    if [[ "$p" =~ ^src/.+\.html$ ]]; then
      continue
    fi
    is_wide=true
    break
  done <"$GIT_NAMES"
fi

if [[ "$is_wide" == true ]]; then
  cp "$ALL" "$ZIPLIST"
  echo "==> zip 対象: フル dist 差分 ($(grep -c . "$ZIPLIST" || echo 0) paths)"
else
  : >"$SEEDS"
  while IFS= read -r p; do
    [[ -z "$p" ]] && continue
    if [[ "$p" == src/public/* ]]; then
      printf '%s\n' "${p#src/public/}"
    elif [[ "$p" =~ ^src/.+\.html$ ]]; then
      printf '%s\n' "${p#src/}"
    fi
  done <"$GIT_NAMES" | sort -u >"$SEEDS"

  if [[ ! -s "$SEEDS" ]]; then
    echo "zip-delivery-dist-diff: Git 差分から dist パスを導出できません。FORCE_WIDE=1 で再試行してください。" >&2
    exit 1
  fi

  comm -12 "$ALL" "$SEEDS" >"$NARROW"

  : >"$EXTRA"
  while IFS= read -r rel; do
    [[ -z "$rel" ]] && continue
    case "$rel" in
    *.html) ;;
    *) continue ;;
    esac
    hf="${WORK_DIST}/${rel}"
    [[ -f "$hf" ]] || continue
    # "./assets/..." or "\"assets/..." を抽出し、差分リスト ALL に含まれるパスのみ
    grep -oE '"(\./)?assets/[^"<>?]+' "$hf" 2>/dev/null | sed 's/^"//;s/^\.\///' | while IFS= read -r r; do
      r="${r%%\?*}"
      [[ -z "$r" ]] && continue
      if grep -qxF "$r" "$ALL"; then
        printf '%s\n' "$r"
      fi
    done >>"$EXTRA"
  done <"$NARROW"

  sort -u "$NARROW" "$EXTRA" >"$ZIPLIST"

  echo "==> zip 対象: ナロー（HTML / public 由来 + 参照 assets の差分のみ: $(grep -c . "$ZIPLIST" || echo 0) paths）"
fi

# PHP フォーム雛形: main に無いだけで「新規」と誤爆しやすい。src/public 側を触ったときだけ含める。
if [[ ! -s "$ZIPLIST" ]]; then
  echo "zip-delivery-dist-diff: フィルタ後の対象が空です。" >&2
  exit 1
fi

if ! grep -q '^src/public/MailForm01_utf8/' "$GIT_NAMES" 2>/dev/null; then
  grep -vE '^MailForm01_utf8(/|$)' "$ZIPLIST" | sort -u >"${ZIPLIST}.tmp" || true
  mv "${ZIPLIST}.tmp" "$ZIPLIST"
fi

if [[ ! -s "$ZIPLIST" ]]; then
  echo "zip-delivery-dist-diff: MailForm 除外後に対象が空です。" >&2
  exit 1
fi

COUNT="$(grep -c . "$ZIPLIST" || true)"
ROOT_NAME="$(basename "$OUT_ZIP" .zip)"
STAGE_ROOT="${AUX}/zip-staging/${ROOT_NAME}"
mkdir -p "$STAGE_ROOT"

while IFS= read -r rel; do
  [[ -z "$rel" ]] && continue
  parent="$(dirname "$rel")"
  if [[ "$parent" != "." ]]; then
    mkdir -p "${STAGE_ROOT}/${parent}"
  fi
  cp -p "${WORK_DIST}/${rel}" "${STAGE_ROOT}/${rel}"
done <"$ZIPLIST"

echo "==> zip (${COUNT} files) → ${OUT_ZIP}（トップ: ${ROOT_NAME}/）"
(cd "${AUX}/zip-staging" && zip -r "$OUT_ZIP" "$ROOT_NAME")

echo "$OUT_ZIP"
