export type Lab = {
  name: string;
  focus: string;
  faculty: string;
  department: string;
  link: string;
  linkAbbr: string;
  teaser: string;
};

export type Course = {
  title: string;
  lecturers: string;
  term: string;
  url: string;
  courseType: string;
  keywords: string[];
  day: string;
  time: string;
  location: string;
};

export type Resource = {
  title: string;
  description: string;
};

export type NewsItem = {
  title: string;
  date: string;
  summary: string;
  slug: string;
};

export type Publication = {
  id: string;
  type: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  pages: string;
  url: string;
};

export type CsvRow = Record<string, string>;
