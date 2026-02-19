#!/usr/bin/env python3
"""
Merge publications_pull.csv with publications.csv.

This script:
1. Reads existing publications from publications.csv
2. Reads new publications from publications_pull.csv
3. Merges them, avoiding duplicates (based on title similarity)
4. Outputs to publications.csv (or a specified file)

Usage:
    python merge_publications.py
    python merge_publications.py --dry-run  # Preview without writing
    python merge_publications.py --output merged.csv  # Write to different file
"""

import argparse
import csv
import re
from pathlib import Path


def normalize_title(title: str) -> str:
    """Normalize title for comparison."""
    # Lowercase, remove punctuation, collapse whitespace
    title = title.lower()
    title = re.sub(r"[^\w\s]", "", title)
    title = re.sub(r"\s+", " ", title).strip()
    return title


def read_csv(path: Path) -> list[dict]:
    """Read publications from CSV."""
    if not path.exists():
        return []
    
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def write_csv(publications: list[dict], path: Path) -> None:
    """Write publications to CSV."""
    if not publications:
        print("No publications to write")
        return
    
    fieldnames = ["id", "type", "title", "authors", "venue", "year", "pages", "url"]
    
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(publications)


def find_duplicates(existing: list[dict], new: list[dict]) -> tuple[list[dict], list[dict]]:
    """
    Find which new publications are duplicates of existing ones.
    
    Returns:
        - List of new publications that are NOT duplicates
        - List of new publications that ARE duplicates
    """
    existing_titles = {normalize_title(pub.get("title", "")) for pub in existing}
    existing_ids = {pub.get("id", "") for pub in existing}
    
    unique = []
    duplicates = []
    
    for pub in new:
        title_norm = normalize_title(pub.get("title", ""))
        pub_id = pub.get("id", "")
        
        if title_norm in existing_titles or pub_id in existing_ids:
            duplicates.append(pub)
        else:
            unique.append(pub)
    
    return unique, duplicates


def merge_publications(existing: list[dict], new_unique: list[dict]) -> list[dict]:
    """Merge existing and new publications, sorted by year descending."""
    merged = existing + new_unique
    
    # Sort by year descending, then by title
    merged.sort(key=lambda x: (-(int(x.get("year", 0) or 0)), x.get("title", "")))
    
    return merged


def main():
    parser = argparse.ArgumentParser(description="Merge DBLP publications with existing publications")
    parser.add_argument("--pull", default="publications_pull.csv", help="Pulled publications file")
    parser.add_argument("--existing", default="publications.csv", help="Existing publications file")
    parser.add_argument("--output", "-o", help="Output file (default: overwrite existing)")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing")
    
    args = parser.parse_args()
    
    # Paths
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent
    
    pull_path = data_dir / args.pull
    existing_path = data_dir / args.existing
    output_path = data_dir / (args.output or args.existing)
    
    # Read files
    print(f"Reading existing publications from: {existing_path}")
    existing = read_csv(existing_path)
    print(f"  Found {len(existing)} existing publications")
    
    print(f"Reading pulled publications from: {pull_path}")
    pulled = read_csv(pull_path)
    print(f"  Found {len(pulled)} pulled publications")
    
    if not pulled:
        print("No pulled publications to merge")
        return
    
    # Find duplicates
    new_unique, duplicates = find_duplicates(existing, pulled)
    
    print(f"\nAnalysis:")
    print(f"  New unique publications: {len(new_unique)}")
    print(f"  Duplicates (will skip): {len(duplicates)}")
    
    if duplicates:
        print("\n  Duplicate titles:")
        for pub in duplicates[:10]:  # Show first 10
            print(f"    - {pub.get('title', '')[:60]}...")
        if len(duplicates) > 10:
            print(f"    ... and {len(duplicates) - 10} more")
    
    if new_unique:
        print("\n  New publications to add:")
        for pub in new_unique[:10]:  # Show first 10
            print(f"    + [{pub.get('year', '')}] {pub.get('title', '')[:50]}...")
        if len(new_unique) > 10:
            print(f"    ... and {len(new_unique) - 10} more")
    
    # Merge
    merged = merge_publications(existing, new_unique)
    
    print(f"\nTotal after merge: {len(merged)} publications")
    
    if args.dry_run:
        print("\n[Dry run - no changes written]")
    else:
        write_csv(merged, output_path)
        print(f"\nWrote merged publications to: {output_path}")


if __name__ == "__main__":
    main()
