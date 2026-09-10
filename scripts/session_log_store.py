#!/usr/bin/env python3
"""session-log の追記・読み出し（追記専用・排他つき）。

session-log の守備範囲は「この案件の、いま生きている引き継ぎ」だけ。
- 行は 次 / 済 の2種のみ。完了の蓄積は Notion タスクログ・日報・git log が正本
- 既存行は書き換えない（複数チャットが同じファイルを持つため）
- 当日以外の見出しは追記時に archive へ退避し、未了の 次 だけ当日へ繰り越す

env: HANDOFF_LOG / HANDOFF_ARCHIVE / HANDOFF_KIND / HANDOFF_SLUG / HANDOFF_BODY
"""
from __future__ import annotations

import fcntl
import os
import re
import sys
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

HEADER = (
    "# セッションログ（当日の引き継ぎのみ）\n"
    "\n"
    "<!-- 追記専用。既存行を書き換えない（複数チャットが同時に書く）。\n"
    "     書き込みは scripts/session-log-append.sh、読み出しは scripts/session-log-live.sh。\n"
    "     前日以前は ai-docs/archive/ へ自動退避され、未了の 次 だけ当日へ繰り越される。 -->\n"
)

DATE_HEADING = re.compile(r"^## (\d{4}-\d{2}-\d{2})\s*$")
ENTRY = re.compile(r"^- \[(\d{2}:\d{2})\] (次|済) \(([^)]+)\)(?::\s*(.*))?$")


@contextmanager
def locked(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    lock = path.with_suffix(path.suffix + ".lock")
    with lock.open("w") as fh:
        fcntl.flock(fh, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(fh, fcntl.LOCK_UN)


def split_sections(text: str) -> tuple[str, list[tuple[str, list[str]]]]:
    """先頭のヘッダ部と、(日付, 行リスト) のリストに割る。"""
    head: list[str] = []
    sections: list[tuple[str, list[str]]] = []
    current: list[str] | None = None
    for line in text.splitlines():
        m = DATE_HEADING.match(line)
        if m:
            current = []
            sections.append((m.group(1), current))
            continue
        if current is None:
            head.append(line)
        else:
            current.append(line)
    return "\n".join(head).rstrip() + "\n", sections


def live_entries(lines: list[str]) -> list[tuple[str, str, str]]:
    """済 で打ち消されていない 次 を (時刻, slug, 本文) で返す。"""
    live: dict[str, tuple[str, str, str]] = {}
    for line in lines:
        m = ENTRY.match(line.strip())
        if not m:
            continue
        ts, kind, slug, body = m.group(1), m.group(2), m.group(3), (m.group(4) or "")
        if kind == "次":
            live[slug] = (ts, slug, body)
        else:
            live.pop(slug, None)
    return list(live.values())


def rotate(head: str, sections: list[tuple[str, list[str]]], today: str, archive_dir: Path):
    """当日以外を archive へ移し、未了の 次 を繰り越し行として返す。"""
    keep = [s for s in sections if s[0] == today]
    old = [s for s in sections if s[0] != today]
    carried: list[str] = []
    if not old:
        return head, keep, carried

    by_month: dict[str, list[str]] = {}
    for date, lines in old:
        body = "\n".join(lines).rstrip()
        block = f"## {date}\n" + (body + "\n" if body else "")
        by_month.setdefault(date[:7], []).append(block)
        for _ts, slug, text in live_entries(lines):
            note = f"{text} (繰越 {date[5:]})" if text else f"(繰越 {date[5:]})"
            carried.append((slug, note))

    archive_dir.mkdir(parents=True, exist_ok=True)
    for month, blocks in by_month.items():
        path = archive_dir / f"session-log-{month}.md"
        prev = path.read_text(encoding="utf-8") if path.exists() else f"# セッションログ退避 {month}\n"
        with path.open("w", encoding="utf-8") as fh:
            fh.write(prev.rstrip() + "\n\n" + "\n\n".join(blocks) + "\n")
    return head, keep, carried


def cmd_append() -> int:
    log = Path(os.environ["HANDOFF_LOG"])
    archive_dir = Path(os.environ["HANDOFF_ARCHIVE"])
    kind = os.environ["HANDOFF_KIND"]
    slug = os.environ["HANDOFF_SLUG"]
    body = os.environ.get("HANDOFF_BODY", "").replace("\n", " ").strip()

    now = datetime.now()
    today, ts = now.strftime("%Y-%m-%d"), now.strftime("%H:%M")

    with locked(log):
        text = log.read_text(encoding="utf-8") if log.exists() else HEADER
        head, sections = split_sections(text)
        head, keep, carried = rotate(head, sections, today, archive_dir)

        lines = keep[0][1] if keep else []
        for c_slug, c_body in carried:
            lines.append(f"- [{ts}] 次 ({c_slug}): {c_body}")
        entry = f"- [{ts}] {kind} ({slug})"
        if body:
            entry += f": {body}"
        lines.append(entry)

        out = head.rstrip() + f"\n\n## {today}\n" + "\n".join(
            l for l in lines if l.strip()
        ) + "\n"
        log.write_text(out, encoding="utf-8")

    print(f"{log}: {entry.strip()}")
    return 0


def cmd_live() -> int:
    log = Path(os.environ["HANDOFF_LOG"])
    if not log.exists():
        print("(session-log なし。生きている引き継ぎはありません)")
        return 0
    _head, sections = split_sections(log.read_text(encoding="utf-8"))
    rows = [row for _date, lines in sections for row in live_entries(lines)]
    if not rows:
        print("(生きている引き継ぎはありません)")
        return 0
    for ts, slug, body in rows:
        print(f"- [{ts}] 次 ({slug}): {body}" if body else f"- [{ts}] 次 ({slug})")
    return 0


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "live"
    raise SystemExit(cmd_append() if cmd == "append" else cmd_live())
