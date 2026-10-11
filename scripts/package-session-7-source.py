#!/usr/bin/env python3
"""Build and verify the deterministic Session 7 classroom release ZIP."""

from __future__ import annotations

import hashlib
import json
import stat
import tempfile
from pathlib import Path, PurePosixPath
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "classroom" / "session-7-source"
OUTPUT = ROOT / "public" / "downloads" / "session-7-final-release-classroom.zip"
ARCHIVE_ROOT = "session-7-final-release-classroom"

# Explicit allowlist, checked against the complete source inventory before use.
FILES = (
    ".firebaserc",
    ".gitignore",
    "README.md",
    "firebase.json",
    "firestore.rules",
    "index.html",
    "package-lock.json",
    "package.json",
    "scripts/seed.mjs",
    "src/domain/inventoryRules.d.mts",
    "src/domain/inventoryRules.mjs",
    "src/firebase/client.ts",
    "src/main.tsx",
    "src/pages/App.tsx",
    "src/services/stocktaking.ts",
    "src/styles.css",
    "src/types.ts",
    "templates/Automated_Regression_Evidence.md",
    "templates/Final_RTM.csv",
    "templates/Final_Regression_Record.csv",
    "templates/Final_Test_Summary.md",
    "templates/Open_Defect_Residual_Risk_Review.csv",
    "tests/regression.test.mjs",
    "tsconfig.json",
    "vite.config.ts",
)
EXPECTED_DIRS = {
    "scripts",
    "src",
    "src/domain",
    "src/firebase",
    "src/pages",
    "src/services",
    "templates",
    "tests",
}
FORBIDDEN_PARTS = {
    ".git",
    ".firebase",
    ".vite",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "cache",
    "caches",
    "logs",
    "__pycache__",
}
FORBIDDEN_SUFFIXES = {
    ".env",
    ".local",
    ".pyc",
    ".tsbuildinfo",
    ".log",
    ".tmp",
    ".bak",
    ".orig",
}
FORBIDDEN_NAMES = {"credentials", "secrets", "service-account", "service_account"}
FIXED_TIME = (1980, 1, 1, 0, 0, 0)


def source_name(relative_path: str) -> PurePosixPath:
    path = PurePosixPath(relative_path)
    if not path.parts or path.is_absolute() or ".." in path.parts or "\\" in relative_path:
        raise ValueError(f"Unsafe source path: {relative_path!r}")
    return path


def archive_name(relative_path: str) -> str:
    return f"{ARCHIVE_ROOT}/{source_name(relative_path).as_posix()}"


def reject_forbidden(relative_path: str) -> None:
    path = source_name(relative_path)
    if FORBIDDEN_PARTS.intersection(path.parts):
        raise ValueError(f"Forbidden packaged path: {relative_path}")
    for part in path.parts:
        lowered = part.lower()
        if any(lowered.endswith(suffix) for suffix in FORBIDDEN_SUFFIXES):
            raise ValueError(f"Forbidden packaged file: {relative_path}")
        if lowered.startswith(".env") or "audit" in lowered and lowered.endswith(".json"):
            raise ValueError(f"Environment or audit dump is not allowed: {relative_path}")
        if any(secret in lowered for secret in FORBIDDEN_NAMES):
            raise ValueError(f"Credential-like filename is not allowed: {relative_path}")


def validate_source() -> None:
    if not SOURCE.is_dir() or SOURCE.is_symlink():
        raise ValueError(f"Source directory is missing or is a symlink: {SOURCE}")

    actual_files: set[str] = set()
    actual_dirs: set[str] = set()
    for path in SOURCE.rglob("*"):
        relative = path.relative_to(SOURCE).as_posix()
        if path.is_symlink():
            raise ValueError(f"Symlink is not allowed: {relative}")
        reject_forbidden(relative)
        if path.is_dir():
            actual_dirs.add(relative)
        elif path.is_file():
            actual_files.add(relative)
        else:
            raise ValueError(f"Unsupported source entry: {relative}")

    expected_files = set(FILES)
    if len(FILES) != len(expected_files):
        raise ValueError("The packager allowlist contains duplicate source paths.")
    if actual_files != expected_files:
        missing = sorted(expected_files - actual_files)
        unexpected = sorted(actual_files - expected_files)
        raise ValueError(f"Source file inventory differs; missing={missing}, unexpected={unexpected}")
    if actual_dirs != EXPECTED_DIRS:
        missing = sorted(EXPECTED_DIRS - actual_dirs)
        unexpected = sorted(actual_dirs - EXPECTED_DIRS)
        raise ValueError(f"Source directory inventory differs; missing={missing}, unexpected={unexpected}")

    for relative in FILES:
        source = SOURCE / source_name(relative)
        if source.is_symlink() or not source.is_file():
            raise ValueError(f"Allowlisted source is not a regular file: {relative}")
        reject_forbidden(relative)


def build(destination: Path) -> None:
    with ZipFile(destination, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        archive.comment = b""
        for relative in FILES:
            info = ZipInfo(archive_name(relative), date_time=FIXED_TIME)
            info.compress_type = ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.flag_bits = 0
            archive.writestr(
                info,
                (SOURCE / source_name(relative)).read_bytes(),
                compress_type=ZIP_DEFLATED,
                compresslevel=9,
            )


def validate_archive(path: Path) -> None:
    expected_names = [archive_name(relative) for relative in FILES]
    with ZipFile(path, "r") as archive:
        if archive.testzip() is not None:
            raise ValueError("ZIP CRC validation failed")
        infos = archive.infolist()
        names = [info.filename for info in infos]
        if names != expected_names or len(names) != len(set(names)):
            raise ValueError("Archive inventory is not the ordered, duplicate-free allowlist")

        for info, relative in zip(infos, FILES, strict=True):
            path_parts = PurePosixPath(info.filename)
            mode = info.external_attr >> 16
            if (
                path_parts.is_absolute()
                or ".." in path_parts.parts
                or "\\" in info.filename
                or not path_parts.parts
                or path_parts.parts[0] != ARCHIVE_ROOT
            ):
                raise ValueError(f"Unsafe archive path: {info.filename}")
            reject_forbidden("/".join(path_parts.parts[1:]))
            if not stat.S_ISREG(mode) or stat.S_IMODE(mode) != 0o644:
                raise ValueError(f"Unexpected entry type or permissions: {info.filename}")
            if info.date_time != FIXED_TIME or info.compress_type != ZIP_DEFLATED:
                raise ValueError(f"Nondeterministic entry metadata: {info.filename}")
            if archive.read(info) != (SOURCE / source_name(relative)).read_bytes():
                raise ValueError(f"Source/archive bytes differ: {info.filename}")

        package = json.loads(archive.read(f"{ARCHIVE_ROOT}/package.json"))
        required_scripts = {"emulators", "seed", "start", "typecheck", "build", "regression"}
        if not required_scripts.issubset(package.get("scripts", {})):
            raise ValueError("package.json is missing required classroom scripts")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    validate_source()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="session-7-determinism-") as temporary:
        first = Path(temporary) / "first.zip"
        second = Path(temporary) / "second.zip"
        build(first)
        build(second)
        validate_archive(first)
        validate_archive(second)
        first_digest = sha256(first)
        second_digest = sha256(second)
        if first_digest != second_digest or first.read_bytes() != second.read_bytes():
            raise ValueError("Two deterministic builds differ")
        OUTPUT.write_bytes(first.read_bytes())

    validate_archive(OUTPUT)
    print(f"Created and validated {OUTPUT.relative_to(ROOT)}")
    print(f"Size: {OUTPUT.stat().st_size} bytes")
    print(f"SHA-256: {sha256(OUTPUT)}")
    print(f"Entries: {len(FILES)} regular files under {ARCHIVE_ROOT}/")
    print("Exact inventory, source bytes, safe paths, permissions, metadata, scripts, CRC, and reproducibility: PASS")


if __name__ == "__main__":
    main()
