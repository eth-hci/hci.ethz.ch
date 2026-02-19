import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import CoursesPageClient from "../../components/CoursesPageClient";
import { loadCourses } from "../../lib/data";

export default async function CoursesPage() {
  const courses = await loadCourses();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <CoursesPageClient courses={courses} />
      </main>
      <Footer />
    </>
  );
}
