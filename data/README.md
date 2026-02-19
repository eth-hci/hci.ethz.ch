# Data Directory

This folder contains canonical CSV data used or related to the HCI@ETH site. Currently, the Next.js app still uses inline arrays; these CSVs are for export/editing and potential future integration.

## Homepage data

- `resources.csv`
  - `title` — Resource title
  - `description` — Short description of the resource

- `news.csv`
  - `title` — News item title
  - `date` — Display date string (e.g., "Spring 2026")
  - `summary` — Short summary of the item

## Groups / labs data

- `groups.csv` (from `_backup/data/groups.json` + `home_labs.csv`)
  - `name` — Research group name
  - `link` — Full URL to group site
  - `linkAbbr` — Short URL label
  - `faculty` — Group leader (Prof.)
  - `department` — Department affiliation
  - `focus` — Optional short description of the lab’s research focus

## Courses / teaching data

- `courses.csv` (from `_backup/data/teaching.json`)
  - `name` — Course name (used as the homepage course title)
  - `lecturers` — Lecturer(s)
  - `term` — Term (e.g., "Spring 2024")
  - `url` — Link to official ETH course information
  - `level` — Audience/level label (e.g., "Master / Bachelor", "Master project course")

- `publications.csv` (from `_backup/data/pubs.bib`)
  - `id` — BibTeX key
  - `type` — Entry type (e.g., `inproceedings`)
  - `title` — Publication title
  - `authors` — Authors separated by `;`
  - `venue` — Conference or journal name
  - `year` — Publication year (numeric)
  - `pages` — Page range
  - `url` — DOI or other stable URL

## Notes

- When editing CSV files, keep the header row intact and use `"..."` quotes if a value contains commas.
- If the app is later wired to read from these CSVs, changes here will drive the site content without code edits.