import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ResourcesSection from "../../components/ResourcesSection";
import { loadResources } from "../../lib/data";

export default async function ResourcesPage() {
  const resources = await loadResources();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <ResourcesSection resources={resources} />
      </main>
      <Footer />
    </>
  );
}
