import Link from "next/link";
import type { Course } from "../lib/types";

type Props = {
  courses: Course[];
};

export default function CoursesPreview({ courses }: Props) {
  // Duplicate courses for seamless infinite scroll
  const duplicatedCourses = [...courses, ...courses];

  return (
    <section id="courses" className="section">
      <header className="section-header">
        <p className="eyebrow">Teaching</p>
        <h2>Courses</h2>
        <p>
          From foundational HCI to advanced electives and seminars, these
          courses cover the design, implementation, and evaluation of
          interactive systems.
        </p>
      </header>

      <Link href="/courses" className="courses-preview-link">
        <div className="courses-scroll-container">
          <div className="courses-scroll-track">
            {duplicatedCourses.map((course, i) => (
              <div key={`${course.title}-${i}`} className="course-preview-card">
                <span className="course-preview-type">{course.courseType}</span>
                <h3 className="course-preview-title">{course.title}</h3>
                <p className="course-preview-lecturers">{course.lecturers}</p>
                <p className="course-preview-term">
                  {course.term === "Non-recurring"
                    ? course.term
                    : `${course.term} Semester`}
                </p>
              </div>
            ))}
          </div>
        </div>
        <span className="courses-preview-cta">
          View all courses →
        </span>
      </Link>
    </section>
  );
}
