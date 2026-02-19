import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import PublicationsSection from "../../components/PublicationsSection";
import { loadPublications } from "../../lib/data";

export default async function PublicationsPage() {
  const publications = await loadPublications();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <PublicationsSection publications={publications} />
      </main>
      <Footer />
    </>
  );
}
