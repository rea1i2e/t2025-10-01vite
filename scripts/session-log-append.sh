#!/usr/bin/env bash
# session-log へ1行追記する（追記専用。既存行は書き換えない）
#
# usage: session-log-append.sh 次|済 <slug> ["本文"]
#   次: このチャットが残す続き（1行で足りるもの）
#   済: 自分が出した 次 を打ち消す（本文は省略可）
#
# env:
#   HANDOFF_PROJECT_ROOT — リポジトリルート（未設定時は git トップ or pwd）
#   HANDOFF_SESSION_LOG  — ログパス（未設定時は scripts/.handoff.conf の SESSION_LOG）
set -euo pipefail

usage() {
  echo 'usage: session-log-append.sh 次|済 <slug> ["本文"]' >&2
  exit 1
}

[[ $# -ge 2 ]] || usage
kind="$1"
slug="$2"
body="${3:-}"

case "$kind" in
  次|済) ;;
  *) echo "error: 第1引数は 次 または 済" >&2; usage ;;
esac

root="${HANDOFF_PROJECT_ROOT:-${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}}"

SESSION_LOG="ai-docs/session-log.md"
ARCHIVE_DIR="ai-docs/archive"
conf="$root/scripts/.handoff.conf"
# shellcheck source=/dev/null
[[ -f "$conf" ]] && . "$conf"

export HANDOFF_LOG="${HANDOFF_SESSION_LOG:-$root/$SESSION_LOG}"
export HANDOFF_ARCHIVE="$root/$ARCHIVE_DIR"
export HANDOFF_KIND="$kind"
export HANDOFF_SLUG="$slug"
export HANDOFF_BODY="$body"

src="${BASH_SOURCE[0]}"
while [[ -L "$src" ]]; do
  dir="$(cd -P "$(dirname "$src")" && pwd)"
  src="$(readlink "$src")"
  [[ "$src" != /* ]] && src="$dir/$src"
done
script_dir="$(cd -P "$(dirname "$src")" && pwd)"

exec python3 "$script_dir/session_log_store.py" append
