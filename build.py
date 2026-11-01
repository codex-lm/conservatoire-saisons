#!/usr/bin/env python3
"""Build the self-contained LOB7 browser export from editable sources."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"


def main() -> None:
    html = (SRC / "index.template.html").read_text(encoding="utf-8")
    replacements = {
        "/*__STYLES__*/": (SRC / "styles.css").read_text(encoding="utf-8"),
        "/*__LEVELS__*/": (SRC / "levels.js").read_text(encoding="utf-8"),
        "/*__CORE__*/": (SRC / "core.js").read_text(encoding="utf-8"),
        "/*__RENDERER__*/": (SRC / "renderer.js").read_text(encoding="utf-8"),
        "/*__GAME__*/": (SRC / "game.js").read_text(encoding="utf-8"),
    }
    for marker, content in replacements.items():
        if marker not in html:
            raise SystemExit(f"Missing template marker: {marker}")
        html = html.replace(marker, content.replace("</script", "<\\/script"))
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    print(f"Built {ROOT / 'index.html'} ({len(html.encode('utf-8')):,} bytes)")


if __name__ == "__main__":
    main()
