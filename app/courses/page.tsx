import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import CoursesSection from "../../components/CoursesSection";
import { loadCourses } from "../../lib/data";

export default async function CoursesPage() {
  const courses = await loadCourses();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <CoursesSection courses={courses} />
      </main>
      <Footer />
    </>
  );
}
