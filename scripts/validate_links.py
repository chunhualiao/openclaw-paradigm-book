#!/usr/bin/env python3
"""
validate_links.py - Check for broken internal links and image references in Markdown files.

Usage:
    python3 scripts/validate_links.py [--book-dir DIR]
    python3 scripts/validate_links.py .

Exits with code 1 if any broken links are found, 0 otherwise.
"""

import argparse
import os
import re
import sys
from pathlib import Path


def find_markdown_files(root):
    """Recursively find all .md files under root, skipping hidden dirs."""
    md_files = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fname in filenames:
            if fname.endswith(".md"):
                md_files.append(Path(dirpath) / fname)
    return sorted(md_files)


def extract_links(content):
    """
    Extract Markdown image refs and links from content.
    Returns list of (kind, path) where kind is 'image' or 'link'.
    Only returns relative (non-http/https/anchor) refs.
    """
    refs = []

    # Images: ![alt](path)
    for m in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', content):
        path = m.group(2).strip()
        if not path.startswith(("http://", "https://", "#", "mailto:")):
            refs.append(("image", path))

    # Links: [text](path) — NOT images
    for m in re.finditer(r'(?<!!)\[([^\]]*)\]\(([^)]+)\)', content):
        path = m.group(2).strip()
        # Strip anchor fragment
        if "#" in path:
            path = path.split("#")[0]
        if path and not path.startswith(("http://", "https://", "mailto:")):
            refs.append(("link", path))

    return refs


def validate(book_dir):
    """Scan all Markdown files and verify internal refs resolve on disk."""
    md_files = find_markdown_files(book_dir)
    broken = []

    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8", errors="replace")
        refs = extract_links(content)
        for kind, ref_path in refs:
            target = (md_file.parent / ref_path).resolve()
            if not target.exists():
                broken.append({
                    "file": md_file.relative_to(book_dir),
                    "kind": kind,
                    "ref": ref_path,
                    "resolved": target,
                })

    if broken:
        print("\n❌ Found {} broken internal reference(s):\n".format(len(broken)))
        for b in broken:
            print("  [{}] {}".format(b["kind"].upper(), b["file"]))
            print("         ref: {}".format(b["ref"]))
            print("    resolved: {}".format(b["resolved"]))
            print()
    else:
        print("\n✅ All internal links valid ({} files checked)\n".format(len(md_files)))

    return len(broken)


def main():
    parser = argparse.ArgumentParser(description="Validate internal Markdown links.")
    parser.add_argument(
        "book_dir",
        nargs="?",
        default=".",
        help="Root directory to scan (default: current directory)",
    )
    parser.add_argument(
        "--book-dir",
        dest="book_dir_flag",
        default=None,
        help="Root directory to scan (alternative flag form)",
    )
    args = parser.parse_args()

    root = Path(args.book_dir_flag or args.book_dir).resolve()
    if not root.is_dir():
        print("Error: {} is not a directory".format(root), file=sys.stderr)
        sys.exit(2)

    print("Scanning: {}".format(root))
    broken_count = validate(root)
    sys.exit(1 if broken_count > 0 else 0)


if __name__ == "__main__":
    main()
