# Data Scripts

Scripts for managing publication data.

## Prerequisites

These scripts use Python 3.10+ with only standard library modules (no external dependencies needed).

## Scripts

### dblp_pull.py

Pull publications from DBLP for an author.

```bash
# Search by author name
python dblp_pull.py "Christian Holz"

# Or use DBLP person ID directly (faster, more accurate)
python dblp_pull.py --pid "73/5765"

# Specify output file
python dblp_pull.py "Christian Holz" -o holz_pubs.csv
```

Output: Creates `publications_pull.csv` (or specified file) in the `data/` directory.

#### Finding DBLP Person ID

1. Go to [dblp.org](https://dblp.org)
2. Search for the author
3. The PID is in the URL: `https://dblp.org/pid/73/5765` → PID is `73/5765`

### merge_publications.py

Merge pulled publications with existing `publications.csv`.

```bash
# Preview changes (dry run)
python merge_publications.py --dry-run

# Merge and update publications.csv
python merge_publications.py

# Merge to a different output file
python merge_publications.py --output publications_merged.csv

# Use different input files
python merge_publications.py --pull holz_pubs.csv --existing publications.csv
```

The script:
- Detects duplicates by comparing normalized titles
- Shows which publications will be added vs skipped
- Sorts merged output by year (newest first)

### deduplicate.py

Remove duplicate publications based on normalized titles.

```bash
# Remove duplicates from publications.csv
python deduplicate.py
```

The script normalizes titles by lowercasing and removing punctuation before comparison.

### clean_authors.py

Clean author names by removing DBLP disambiguation numbers (e.g., "0001", "0002").

```bash
# Clean author names in publications.csv
python clean_authors.py
```

Example: `Christian Holz 0001` → `Christian Holz`

### clean_venues.py

Clean venue names by removing trailing numbers in parentheses (e.g., "(5)", "(2)").

```bash
# Clean venue names in publications.csv
python clean_venues.py
```

Example: `CHI (5)` → `CHI`

## Typical Workflow

```bash
cd data/scripts

# 1. Pull publications for an author
python dblp_pull.py "Christian Holz"

# 2. Preview merge
python merge_publications.py --dry-run

# 3. If satisfied, merge
python merge_publications.py

# 4. Remove duplicates
python deduplicate.py

# 5. Clean author names and venues
python clean_authors.py
python clean_venues.py
```

## CSV Format

Publications CSV columns:
- `id` - Unique identifier (e.g., `holz2023structured`)
- `type` - Publication type (`inproceedings`, `article`, `book`, etc.)
- `title` - Publication title
- `authors` - Authors separated by semicolons (e.g., `Holz, Christian; Smith, John`)
- `venue` - Journal or conference name
- `year` - Publication year
- `pages` - Page range (e.g., `1--15`)
- `url` - DOI or direct link
