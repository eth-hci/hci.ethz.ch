#!/usr/bin/env python3
"""Remove duplicate publications by title."""

import csv
from pathlib import Path

data_dir = Path(__file__).parent.parent
pub_path = data_dir / "publications.csv"

# Read all publications
with open(pub_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    pubs = list(reader)

print(f"Total publications: {len(pubs)}")

# Deduplicate by normalized title
seen_titles = set()
unique_pubs = []
duplicates = []

for pub in pubs:
    title_norm = pub.get("title", "").lower().strip()
    if title_norm not in seen_titles:
        seen_titles.add(title_norm)
        unique_pubs.append(pub)
    else:
        duplicates.append(pub)

print(f"Unique publications: {len(unique_pubs)}")
print(f"Duplicates removed: {len(duplicates)}")

if duplicates:
    print("\nDuplicate titles removed:")
    for d in duplicates[:20]:
        print(f"  - {d.get('title', '')[:60]}...")
    if len(duplicates) > 20:
        print(f"  ... and {len(duplicates) - 20} more")

# Write back
fieldnames = ["id", "type", "title", "authors", "venue", "year", "pages", "url"]
with open(pub_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(unique_pubs)

print(f"\nWrote {len(unique_pubs)} unique publications to publications.csv")
