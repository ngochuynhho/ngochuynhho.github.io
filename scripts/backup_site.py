#!/usr/bin/env python3
"""Create a local backup, or safely restore an existing website archive."""
import argparse
from datetime import datetime, timezone
from pathlib import Path
import tarfile

SITE_PATHS = ("index.html", "admin.html", "README.md", "IMAGE_BRIEF.md", "BLOG_BRIEF.md", "blog", "content", "templates", "tools", "assets", "cv", "data", "scripts", "tests",
              ".github", ".gitignore", ".nojekyll", "robots.txt", "sitemap.xml")


def create_backup(root: Path, output: Path | None = None) -> Path:
    if output is None:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        output = root / ".backups" / f"portfolio-{stamp}.tar.gz"
    output.parent.mkdir(parents=True, exist_ok=True)
    with tarfile.open(output, "w:gz") as archive:
        for name in SITE_PATHS:
            path = root / name
            if path.exists():
                archive.add(path, arcname=name, filter=lambda info: None if "__pycache__" in Path(info.name).parts else info)
    return output


def restore_backup(root: Path, archive_path: Path) -> Path:
    with tarfile.open(archive_path, "r:gz") as archive:
        members = archive.getmembers()
        for member in members:
            path = Path(member.name)
            if (path.is_absolute() or ".." in path.parts or not path.parts
                    or path.parts[0] not in SITE_PATHS or member.issym() or member.islnk()
                    or not (member.isfile() or member.isdir())):
                raise ValueError("Archive contains an unsafe or unexpected path; nothing was restored.")
        safety_backup = create_backup(root)
        archive.extractall(root, members=members, filter="data")
    return safety_backup


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--restore", type=Path, help="Restore a .tar.gz backup after taking another safety backup")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    if args.restore:
        saved = restore_backup(root, args.restore.resolve())
        print(f"Website restored. Pre-restore safety backup: {saved}")
    else:
        print(f"Website backup: {create_backup(root)}")


if __name__ == "__main__":
    main()
