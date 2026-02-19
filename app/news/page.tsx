import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection";
import { loadNews } from "../../lib/data";

export default async function NewsPage() {
  const news = await loadNews();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <NewsSection news={news} />
      </main>
      <Footer />
    </>
  );
}
