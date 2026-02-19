#!/usr/bin/env python3
"""Clean venue names by removing trailing numbers in parentheses like (5), (2), etc."""

import csv
import re
from pathlib import Path

data_dir = Path(__file__).parent.parent
pub_path = data_dir / "publications.csv"

with open(pub_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    pubs = list(reader)

# Clean venue names - remove trailing numbers in parentheses
def clean_venue(venue_str):
    # Remove patterns like " (5)", " (12)", etc.
    venue_str = re.sub(r"\s*\(\d+\)\s*$", "", venue_str.strip())
    return venue_str

changed_count = 0
for pub in pubs:
    old_venue = pub.get("venue", "")
    new_venue = clean_venue(old_venue)
    if old_venue != new_venue:
        pub["venue"] = new_venue
        changed_count += 1

# Write back
fieldnames = ["id", "type", "title", "authors", "venue", "year", "pages", "url"]
with open(pub_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(pubs)

print(f"Cleaned {changed_count} venue names in {len(pubs)} publications")
