#!/usr/bin/env bash
# 人間用の入り口（AI が使えないときのフォールバック）。
# 中身は session-log-append.sh と同じ。追記専用。
#
# usage: handoff-note.sh <slug> "続きの内容"
#        handoff-note.sh --done <slug>
set -euo pipefail

src="${BASH_SOURCE[0]}"
while [[ -L "$src" ]]; do
  dir="$(cd -P "$(dirname "$src")" && pwd)"
  src="$(readlink "$src")"
  [[ "$src" != /* ]] && src="$dir/$src"
done
script_dir="$(cd -P "$(dirname "$src")" && pwd)"

if [[ "${1:-}" == "--done" ]]; then
  exec "$script_dir/session-log-append.sh" 済 "${2:?usage: handoff-note.sh --done <slug>}"
fi

slug="${1:?usage: handoff-note.sh <slug> \"続きの内容\"}"
shift
exec "$script_dir/session-log-append.sh" 次 "$slug" "$*"
