#!/usr/bin/env python3
"""Create and verify the deterministic Session 6 RC-1 classroom ZIP."""

from __future__ import annotations

import hashlib
import json
import stat
import tempfile
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "classroom" / "session-6-source"
OUTPUT = ROOT / "public" / "downloads" / "session-6-release-candidate-classroom.zip"
ARCHIVE_ROOT = "session-6-release-candidate-classroom"
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
REQUIRED_DIRS = {"scripts", "src", "src/firebase", "src/pages", "src/services"}
FORBIDDEN_PARTS = {".git", "node_modules", "dist", "build", ".firebase", "__pycache__", "cache", "logs"}
FORBIDDEN_SUFFIXES = {".env", ".local", ".pyc", ".tsbuildinfo", ".log"}


def archive_name(relative_path: str) -> str:
    path = PurePosixPath(relative_path)
    if path.is_absolute() or ".." in path.parts or "\\" in relative_path or not path.parts:
        raise ValueError(f"Unsafe source path: {relative_path}")
    return f"{ARCHIVE_ROOT}/{path.as_posix()}"


def validate_source() -> None:
    if not SOURCE.is_dir() or SOURCE.is_symlink():
        raise ValueError(f"Source directory is missing or is a symlink: {SOURCE}")
    expected_files = set(FILES)
    expected_dirs = REQUIRED_DIRS
    actual_files: set[str] = set()
    actual_dirs: set[str] = set()
    for path in SOURCE.rglob("*"):
        relative = path.relative_to(SOURCE).as_posix()
        if path.is_symlink():
            raise ValueError(f"Symlinks are not allowed: {relative}")
        if path.is_dir():
            actual_dirs.add(relative)
        elif path.is_file():
            actual_files.add(relative)
        else:
            raise ValueError(f"Unexpected non-file source entry: {relative}")
    if actual_files != expected_files:
        raise ValueError(f"Source file inventory differs from allowlist; missing={sorted(expected_files-actual_files)}, unexpected={sorted(actual_files-expected_files)}")
    if actual_dirs != expected_dirs:
        raise ValueError(f"Source directory inventory differs; missing={sorted(expected_dirs-actual_dirs)}, unexpected={sorted(actual_dirs-expected_dirs)}")
    for relative in FILES:
        if any(part in FORBIDDEN_PARTS for part in PurePosixPath(relative).parts):
            raise ValueError(f"Forbidden packaged path: {relative}")
        if any(part.endswith(suffix) for part in PurePosixPath(relative).parts for suffix in FORBIDDEN_SUFFIXES):
            raise ValueError(f"Forbidden packaged file: {relative}")


def build(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(path, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        archive.comment = b""
        for relative in FILES:
            entry = ZipInfo(archive_name(relative), date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = (stat.S_IFREG | 0o644) << 16
            entry.flag_bits = 0
            archive.writestr(entry, (SOURCE / relative).read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)


def validate(path: Path) -> None:
    expected_names = [archive_name(relative) for relative in FILES]
    with ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError("ZIP CRC validation failed")
        infos = archive.infolist()
        names = [info.filename for info in infos]
        if names != expected_names or len(set(names)) != len(names):
            raise ValueError("Archive listing is not the ordered, duplicate-free allowlist")
        for info, relative in zip(infos, FILES, strict=True):
            name = info.filename
            item = PurePosixPath(name)
            mode = info.external_attr >> 16
            if item.is_absolute() or ".." in item.parts or "\\" in name or item.parts[0] != ARCHIVE_ROOT:
                raise ValueError(f"Unsafe archive path: {name}")
            if FORBIDDEN_PARTS.intersection(item.parts[1:]) or stat.S_ISLNK(mode) or not stat.S_ISREG(mode):
                raise ValueError(f"Forbidden archive entry: {name}")
            if archive.read(info) != (SOURCE / relative).read_bytes():
                raise ValueError(f"Source/archive bytes differ: {name}")
        package = json.loads(archive.read(f"{ARCHIVE_ROOT}/package.json"))
        required = {"emulators", "seed", "start", "typecheck", "build"}
        if not required.issubset(package.get("scripts", {})):
            raise ValueError("package.json is missing required classroom scripts")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    validate_source()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="session-6-package-") as temporary:
        first = Path(temporary) / "first.zip"
        second = Path(temporary) / "second.zip"
        build(first)
        build(second)
        validate(first)
        validate(second)
        if digest(first) != digest(second):
            raise ValueError("Two deterministic builds produced different SHA-256 hashes")
        OUTPUT.write_bytes(first.read_bytes())
    validate(OUTPUT)
    print(f"Created and validated {OUTPUT.relative_to(ROOT)}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")
    print(f"SHA-256: {digest(OUTPUT)}")
    print(f"Entries: {len(FILES)} source files under {ARCHIVE_ROOT}/")
    print("Integrity, exact ordered allowlist, paths, permissions, source bytes, and reproducibility: PASS")


if __name__ == "__main__":
    main()
