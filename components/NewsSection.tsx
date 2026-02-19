import Link from "next/link";
import type { NewsItem } from "../lib/types";

type Props = {
  news: NewsItem[];
  limit?: number;
};

export default function NewsSection({ news, limit }: Props) {
  const displayedNews = limit ? news.slice(0, limit) : news;
  const hasMore = limit && news.length > limit;

  return (
    <section id="news" className="section section-alt">
      <header className="section-header">
        <p className="eyebrow">Updates</p>
        <h2>News</h2>
        <p>Highlights from the ETH HCI community.</p>
      </header>
      <div className="news-list">
        {displayedNews.map((item) => (
          <article key={item.title} className="news-item">
            <p className="meta">{item.date}</p>
            <h3>
              {item.slug ? (
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              ) : (
                item.title
              )}
            </h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
      {hasMore && (
        <div className="section-footer">
          <Link href="/news" className="view-more-btn">
            View more
          </Link>
        </div>
      )}
    </section>
  );
}
