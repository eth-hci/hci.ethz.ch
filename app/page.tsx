import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import LabsSection from "../components/LabsSection";
import CoursesPreview from "../components/CoursesPreview";
import PublicationsSection from "../components/PublicationsSection";
import NewsSection from "../components/NewsSection";
import { loadLabs, loadCourses, loadNews, loadPublications } from "../lib/data";

export default async function HomePage() {
  const [labs, courses, news, publications] = await Promise.all([
    loadLabs(),
    loadCourses(),
    loadNews(),
    loadPublications(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <HeroSection />
        <LabsSection labs={labs} />
        <CoursesPreview courses={courses} />
        <NewsSection news={news} limit={2} />
        <PublicationsSection publications={publications} limit={5} showFilters={false} />
      </main>
      <Footer />
    </>
  );
}

