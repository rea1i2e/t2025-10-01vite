#!/usr/bin/env bash
# いま生きている引き継ぎ（済 で打ち消されていない 次）だけを出す。
# 次のチャットはこれを読む。session-log の全文は読まない。
set -euo pipefail

root="${HANDOFF_PROJECT_ROOT:-${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}}"

SESSION_LOG="ai-docs/session-log.md"
ARCHIVE_DIR="ai-docs/archive"
conf="$root/scripts/.handoff.conf"
# shellcheck source=/dev/null
[[ -f "$conf" ]] && . "$conf"

export HANDOFF_LOG="${HANDOFF_SESSION_LOG:-$root/$SESSION_LOG}"
export HANDOFF_ARCHIVE="$root/$ARCHIVE_DIR"

src="${BASH_SOURCE[0]}"
while [[ -L "$src" ]]; do
  dir="$(cd -P "$(dirname "$src")" && pwd)"
  src="$(readlink "$src")"
  [[ "$src" != /* ]] && src="$dir/$src"
done
script_dir="$(cd -P "$(dirname "$src")" && pwd)"

exec python3 "$script_dir/session_log_store.py" live
