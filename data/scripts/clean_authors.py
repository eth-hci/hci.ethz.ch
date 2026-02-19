#!/usr/bin/env python3
"""Clean author names by removing DBLP disambiguation numbers."""

import csv
import re
from pathlib import Path

data_dir = Path(__file__).parent.parent
pub_path = data_dir / "publications.csv"

with open(pub_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    pubs = list(reader)

# Clean author names - remove trailing numbers like 0001, 0002
def clean_authors(authors_str):
    # Split by semicolon, clean each author
    authors = authors_str.split(";")
    cleaned = []
    for author in authors:
        # Remove trailing digits (like ' 0001' or '0002')
        author = re.sub(r"\s+\d{4}$", "", author.strip())
        cleaned.append(author)
    return "; ".join(cleaned)

for pub in pubs:
    pub["authors"] = clean_authors(pub.get("authors", ""))

# Write back
fieldnames = ["id", "type", "title", "authors", "venue", "year", "pages", "url"]
with open(pub_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(pubs)

print(f"Cleaned author names in {len(pubs)} publications")
