#!/usr/bin/env python3
"""Build and validate a reproducible ZIP of the approved Session 5 source."""

from __future__ import annotations

import hashlib
import json
import stat
import tempfile
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "classroom" / "session-5-source"
OUTPUT = ROOT / "public" / "downloads" / "session-5-firestore-emulator-classroom.zip"
ARCHIVE_ROOT = "session-5-firestore-emulator-classroom"
FILES = (
    ".firebaserc",
    ".gitignore",
    "README.md",
    "firebase.json",
    "firestore.rules",
    "index.html",
    "package.json",
    "package-lock.json",
    "scripts/seed.mjs",
    "src/firebase/client.ts",
    "src/main.tsx",
    "src/pages/App.tsx",
    "src/services/stocktaking.ts",
    "src/styles.css",
    "src/types.ts",
    "tsconfig.json",
    "vite.config.ts",
)
REQUIRED_SCRIPTS = {"emulators", "seed", "start", "typecheck", "build"}
FORBIDDEN_PARTS = {
    ".git",
    "node_modules",
    "dist",
    ".firebase",
    "__pycache__",
}
FORBIDDEN_SUFFIXES = {".env", ".local", ".pyc", ".tsbuildinfo"}


def archive_name(relative_path: str) -> str:
    path = PurePosixPath(relative_path)
    if path.is_absolute() or ".." in path.parts or "\\" in relative_path:
        raise ValueError(f"Unsafe source path: {relative_path}")
    return f"{ARCHIVE_ROOT}/{path.as_posix()}"


def validate_archive() -> None:
    with ZipFile(OUTPUT, "r") as archive:
        bad_entry = archive.testzip()
        if bad_entry:
            raise ValueError(f"Corrupt ZIP entry: {bad_entry}")

        names = archive.namelist()
        expected = {archive_name(path) for path in FILES}
        if set(names) != expected or len(names) != len(expected):
            raise ValueError("ZIP listing does not exactly match the source allowlist.")

        for info in archive.infolist():
            path = PurePosixPath(info.filename)
            if path.is_absolute() or ".." in path.parts or "\\" in info.filename:
                raise ValueError(f"Unsafe archive path: {info.filename}")
            if path.parts[0] != ARCHIVE_ROOT:
                raise ValueError(f"Unexpected archive root: {info.filename}")
            if FORBIDDEN_PARTS.intersection(path.parts[1:]):
                raise ValueError(f"Forbidden packaged path: {info.filename}")
            if any(part == suffix or part.endswith(suffix) for part in path.parts for suffix in FORBIDDEN_SUFFIXES):
                raise ValueError(f"Forbidden packaged file: {info.filename}")
            if stat.S_ISLNK(info.external_attr >> 16):
                raise ValueError(f"Symlink is not allowed: {info.filename}")
            if archive.read(info.filename) != (SOURCE / PurePosixPath(*path.parts[1:])).read_bytes():
                raise ValueError(f"Packaged source differs from approved source: {info.filename}")

        package = json.loads(archive.read(f"{ARCHIVE_ROOT}/package.json"))
        if not REQUIRED_SCRIPTS.issubset(package.get("scripts", {})):
            raise ValueError("The package is missing one or more required npm scripts.")

        with tempfile.TemporaryDirectory(prefix="session-5-zip-check-") as temporary:
            archive.extractall(temporary)
            extracted = Path(temporary) / ARCHIVE_ROOT
            if not (extracted / "package-lock.json").is_file():
                raise ValueError("Extracted project is missing package-lock.json.")
            if not (extracted / "src" / "pages" / "App.tsx").is_file():
                raise ValueError("Extracted project is missing React source.")


def main() -> None:
    if not SOURCE.is_dir():
        raise FileNotFoundError(SOURCE)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w") as archive:
        archive.comment = b""
        for relative_path in FILES:
            source_path = SOURCE / relative_path
            if source_path.is_symlink():
                raise ValueError(f"Symlinks are not allowed: {source_path}")
            if not source_path.is_file():
                raise FileNotFoundError(source_path)

            entry = ZipInfo(archive_name(relative_path), date_time=(2024, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = (stat.S_IFREG | 0o644) << 16
            archive.writestr(entry, source_path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)

    validate_archive()
    digest = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
    print(f"Created and validated {OUTPUT.relative_to(ROOT)}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")
    print(f"SHA-256: {digest}")
    print(f"Entries: {len(FILES)} source files under {ARCHIVE_ROOT}/")
    print("ZIP integrity, allowlist, paths, source hashes, and required npm scripts: PASS")
    print("Project extracted to a temporary directory for structure checks; it was not runtime-tested.")


if __name__ == "__main__":
    main()
