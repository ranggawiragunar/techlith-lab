#!/usr/bin/env python3
"""Create a deterministic, allowlisted student ZIP from the classroom source."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "classroom" / "session-3-source"
OUTPUT = ROOT / "public" / "downloads" / "session-3-inventory-classroom.zip"
FILES = (
    "README.md",
    "package.json",
    "package-lock.json",
    "public/index.html",
    "src/App.js",
    "src/index.js",
    "src/inventoryRules.js",
    "src/inventoryRules.test.js",
    "src/styles.css",
)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for relative_path in FILES:
            source_path = SOURCE / relative_path
            if not source_path.is_file():
                raise FileNotFoundError(source_path)
            entry = ZipInfo(f"session-3-inventory-classroom/{relative_path}", date_time=(2024, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, source_path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    print(f"Created {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
