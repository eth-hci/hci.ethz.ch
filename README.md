# ETH HCI Collective Website

A unified hub for the human-computer interaction research community at ETH Zurich.

**Live site:** [hci.ethz.ch](https://hci.ethz.ch)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS (globals.css) with CSS variables
- **Data:** CSV files as flat-file CMS
- **Deployment:** GitHub Pages via GitHub Actions

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npx serve out
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── courses/           # Courses page
│   ├── news/              # News page + [slug] dynamic routes
│   ├── publications/      # Publications page
│   └── resources/         # Resources page
├── components/            # React components
├── data/                  # CSV data files (content)
│   ├── courses.csv
│   ├── groups.csv
│   ├── news.csv
│   ├── news/              # Markdown articles for news
│   ├── publications.csv
│   ├── resources.csv
│   └── scripts/           # Python scripts for data management
├── lib/                   # Data loading utilities
├── public/                # Static assets (images, fonts)
└── styles/                # Additional styles
```

---

## Updating Content

All site content is stored in CSV files in the `data/` directory. Edit these files directly—no code changes needed.

### Labs / Research Groups

**File:** `data/groups.csv`

| Column | Description |
|--------|-------------|
| `name` | Research group name |
| `link` | Full URL to group website |
| `linkAbbr` | Short URL label (e.g., "ait.ethz.ch") |
| `faculty` | Group leader name |
| `department` | Department affiliation |
| `focus` | Short description of research focus |
| `teaser` | One-line teaser for homepage |
| `keywords` | Comma-separated keywords |
| `dblp` | DBLP person ID for publication pulling |

**Example:**
```csv
name,link,linkAbbr,faculty,department,focus,teaser,keywords,dblp
AIT Lab,https://ait.ethz.ch,ait.ethz.ch,Prof. Otmar Hilliges,D-INFK,Computer Vision and Machine Learning for HCI,Sensing and understanding humans,computer vision;machine learning,h/Hilliges:Otmar
```

### Courses

**File:** `data/courses.csv`

| Column | Description |
|--------|-------------|
| `name` | Course title |
| `lecturers` | Lecturer names (comma-separated for multiple) |
| `term` | Semester: `Spring`, `Fall`, or `Non-recurring` |
| `url` | Link to ETH course page |
| `courseType` | Type: `Lecture`, `Seminar`, `Lab`, `Project` |
| `keywords` | Comma-separated keywords for filtering |

**Example:**
```csv
name,lecturers,term,url,courseType,keywords
Human Computer Interaction,"Otmar Hilliges, Christian Holz",Spring,https://ethz.ch/...,Lecture,interaction;design
```

### News

News items have two parts: a CSV entry and a markdown article.

**File:** `data/news.csv`

| Column | Description |
|--------|-------------|
| `title` | News headline |
| `date` | Display date (e.g., "February 2026") |
| `summary` | Short summary for listing pages |
| `slug` | URL slug (must match markdown filename) |

**Example:**
```csv
title,date,summary,slug
New Website Launched,February 2026,The ETH HCI Collective website is live!,new-website-launched
```

**Markdown article:** `data/news/new-website-launched.md`

```markdown
# New Website Launched

Your article content here. Supports:

- **Bold** and *italic* text
- [Links](https://example.com)
- ## Headings

<figure style="max-width: 400px; margin: 0 auto;">
  <img src="/news/photo.jpg" alt="Description" />
  <figcaption>Caption text</figcaption>
</figure>
```

**Adding images to news:**
1. Place image in `public/news/`
2. Reference as `/news/filename.jpg` in markdown

### Publications

**File:** `data/publications.csv`

| Column | Description |
|--------|-------------|
| `id` | Unique identifier (e.g., `smith2024learning`) |
| `type` | Publication type: `inproceedings`, `article`, `book` |
| `title` | Publication title |
| `authors` | Authors separated by semicolons |
| `venue` | Conference or journal name |
| `year` | Publication year |
| `pages` | Page range (e.g., `1--15`) |
| `url` | DOI or direct link |

**Example:**
```csv
id,type,title,authors,venue,year,pages,url
smith2024learning,inproceedings,Learning Human Behavior,Smith, John; Doe, Jane,CHI,2024,1--12,https://doi.org/...
```

### Resources

**File:** `data/resources.csv`

| Column | Description |
|--------|-------------|
| `title` | Resource name |
| `description` | Short description |

---

## Managing Publications from DBLP

Scripts in `data/scripts/` automate pulling publications from DBLP.

```bash
cd data/scripts

# 1. Pull publications for an author (by name or DBLP PID)
python dblp_pull.py "Christian Holz"
python dblp_pull.py --pid "73/5765"

# 2. Preview merge with existing publications
python merge_publications.py --dry-run

# 3. Merge new publications
python merge_publications.py

# 4. Remove duplicates
python deduplicate.py

# 5. Clean author names (remove DBLP disambiguation numbers)
python clean_authors.py

# 6. Clean venue names (remove trailing numbers)
python clean_venues.py
```

**Finding DBLP Person ID:**
1. Go to [dblp.org](https://dblp.org)
2. Search for the author
3. The PID is in the URL: `https://dblp.org/pid/73/5765` → PID is `73/5765`

---

## Deployment

The site deploys automatically to GitHub Pages when you push to the `v2` branch.

**Manual deployment:**
```bash
npm run build    # Creates ./out directory
# Upload ./out to your hosting provider
```

**GitHub Pages setup:**
1. Go to repo Settings → Pages
2. Under "Build and deployment", select **GitHub Actions**
3. Push to `v2` branch to trigger deployment

---

## CSV Editing Tips

- Keep the header row intact
- Use `"..."` quotes for values containing commas
- For multi-line values, wrap in quotes and use actual line breaks
- Keywords should be comma-separated within the field
- Authors should be semicolon-separated

**Example with commas:**
```csv
title,description
"Hello, World","A short, sweet intro"
```

---

## Dark Mode

The site supports dark mode via a toggle in the header. User preference is saved to localStorage.

---

## Contributing

1. Create a branch from `v2`
2. Make your changes
3. Test locally with `npm run dev`
4. Build to check for errors: `npm run build`
5. Submit a pull request

---

## License

© ETH Zurich · Human-Computer Interaction
