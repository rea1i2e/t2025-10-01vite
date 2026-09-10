#!/usr/bin/env bash
# フックの事故ログを1行 append する（Claude Code StopFailure / Cursor sessionEnd 共通）。
#
# session-log には書かない。引き継ぎ（次 / 済）と、機械が吐く事故ログは別ファイル。
# usage: handoff-snapshot.sh TAG "detail" [PROJECT_ROOT]
set -euo pipefail

tag="${1:?usage: handoff-snapshot.sh TAG \"detail\" [PROJECT_ROOT]}"
detail="${2:-}"
root="${3:-${HANDOFF_PROJECT_ROOT:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"

SNAPSHOT_LOG="ai-docs/session-snapshots.log"
conf="$root/scripts/.handoff.conf"
# shellcheck source=/dev/null
[[ -f "$conf" ]] && . "$conf"
log="${HANDOFF_SNAPSHOT_LOG:-$root/$SNAPSHOT_LOG}"

mkdir -p "$(dirname "$log")"

git_summary="$(git -C "$root" status --short 2>/dev/null | head -5 | paste -sd';' - || true)"
[[ -n "$git_summary" ]] || git_summary="clean"

line="$(date '+%Y-%m-%d %H:%M') ${tag}"
[[ -n "$detail" ]] && line+=": $(printf '%s' "$detail" | tr '\n' ' ' | cut -c1-120)"
line+=" | git: ${git_summary}"

printf '%s\n' "$line" >>"$log"
