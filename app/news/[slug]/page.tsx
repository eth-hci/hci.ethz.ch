import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import { loadNewsBySlug, loadNewsArticle } from "../../../lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [newsItem, content] = await Promise.all([
    loadNewsBySlug(slug),
    loadNewsArticle(slug),
  ]);

  if (!newsItem || !content) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="page">
        <article className="article-page">
          <header className="article-header">
            <Link href="/news" className="back-link">
              ← All News
            </Link>
            <p className="meta">{newsItem.date}</p>
            <h1>{newsItem.title}</h1>
          </header>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

function parseMarkdown(md: string): string {
  // First handle images (must be before links due to similar syntax)
  let processed = md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<figure><img src="$2" alt="$1" /><figcaption>$1</figcaption></figure>'
  );

  // Split into blocks by double newlines
  const blocks = processed.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);

  const htmlBlocks = blocks.map((block) => {
    // Pass through raw HTML blocks (starts with <tag)
    if (block.startsWith("<")) {
      return block;
    }

    // Headers
    if (block.startsWith("# ")) {
      return `<h1>${block.slice(2)}</h1>`;
    }
    if (block.startsWith("## ")) {
      return `<h2>${block.slice(3)}</h2>`;
    }
    if (block.startsWith("### ")) {
      return `<h3>${block.slice(4)}</h3>`;
    }

    // Regular paragraph - apply inline formatting
    let p = block
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return `<p>${p}</p>`;
  });

  return htmlBlocks.join("\n");
}
