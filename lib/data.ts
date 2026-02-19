import fs from "fs";
import path from "path";
import type { Lab, Course, Resource, NewsItem, Publication, CsvRow } from "./types";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function parseCsv(text: string): CsvRow[] {
  const physicalLines = text.split(/\r?\n/);
  const logicalLines: string[] = [];

  let buffer = "";
  let inQuotes = false;

  physicalLines.forEach((line) => {
    if (buffer.length > 0) {
      buffer += "\n" + line;
    } else {
      buffer = line;
    }

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === "\"") {
        if (inQuotes && line[i + 1] === "\"") {
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      }
    }

    if (!inQuotes) {
      if (buffer.trim().length > 0) {
        logicalLines.push(buffer);
      }
      buffer = "";
    }
  });

  if (logicalLines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(logicalLines[0]);

  return logicalLines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

async function loadCsv(fileName: string): Promise<CsvRow[]> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const content = await fs.promises.readFile(filePath, "utf8");
  return parseCsv(content);
}

export async function loadLabs(): Promise<Lab[]> {
  const rows = await loadCsv("groups.csv");
  const labs: Lab[] = rows.map((row) => ({
    name: row.name ?? "",
    faculty: row.faculty ?? "",
    department: row.department ?? "",
    link: row.link ?? "",
    linkAbbr: row.linkAbbr ?? "",
    teaser: row.teaser ?? "",
    focus: (() => {
      const rawFocus =
        row.focus && row.focus.length > 0
          ? row.focus
          : row.department && row.faculty
          ? `${row.department} · Prof. ${row.faculty}`
          : row.department || row.faculty || "";
      return rawFocus.replace(/\s+/g, " ").trim();
    })(),
  }));

  // Shuffle labs
  for (let i = labs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = labs[i];
    labs[i] = labs[j];
    labs[j] = temp;
  }

  return labs;
}

export async function loadCourses(): Promise<Course[]> {
  const rows = await loadCsv("courses.csv");
  return rows.map((row) => ({
    title: row.name ?? "",
    lecturers: row.lecturers ?? "",
    term: row.term ?? "",
    url: row.url ?? "",
    courseType: row.courseType ?? "",
    keywords: (row.keywords ?? "")
      .split(";")
      .map((k: string) => k.trim())
      .filter(Boolean),
  }));
}

export async function loadResources(): Promise<Resource[]> {
  const rows = await loadCsv("resources.csv");
  return rows.map((row) => ({
    title: row.title ?? "",
    description: row.description ?? "",
  }));
}

export async function loadNews(): Promise<NewsItem[]> {
  const rows = await loadCsv("news.csv");
  return rows.map((row) => ({
    title: row.title ?? "",
    date: row.date ?? "",
    summary: row.summary ?? "",
    slug: row.slug ?? "",
  }));
}

export async function loadNewsArticle(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "news", `${slug}.md`);
    const content = await fs.promises.readFile(filePath, "utf8");
    return content;
  } catch {
    return null;
  }
}

export async function loadNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await loadNews();
  return news.find((n) => n.slug === slug) ?? null;
}

export async function loadPublications(): Promise<Publication[]> {
  const rows = await loadCsv("publications.csv");
  return rows.map((row) => ({
    id: row.id ?? "",
    type: row.type ?? "",
    title: row.title ?? "",
    authors: row.authors ?? "",
    venue: row.venue ?? "",
    year: row.year ?? "",
    pages: row.pages ?? "",
    url: row.url ?? "",
  }));
}
