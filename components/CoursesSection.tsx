"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Course } from "../lib/types";

type Props = {
    courses: Course[];
    limit?: number;
    showFilters?: boolean;
    showHeader?: boolean;
};

export default function CoursesSection({ courses, limit, showFilters = true, showHeader = true }: Props) {
    const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

    // Extract unique filter options
    const courseTypes = useMemo(
        () => Array.from(new Set(courses.map((c) => c.courseType).filter(Boolean))),
        [courses]
    );
    const semesters = useMemo(
        () => Array.from(new Set(courses.map((c) => c.term).filter(Boolean))),
        [courses]
    );
    const lecturers = useMemo(() => {
        const all = courses.flatMap((c) =>
            c.lecturers.split(",").map((l) => l.trim()).filter(Boolean)
        );
        return Array.from(new Set(all));
    }, [courses]);
    const keywords = useMemo(() => {
        const all = courses.flatMap((c) => c.keywords);
        return Array.from(new Set(all));
    }, [courses]);

    const toggleFilter = (filter: string) => {
        setActiveFilters((prev) => {
            const next = new Set(prev);
            if (next.has(filter)) {
                next.delete(filter);
            } else {
                next.add(filter);
            }
            return next;
        });
    };

    const clearFilters = () => setActiveFilters(new Set());

    // Filter courses
    const filteredCourses = useMemo(() => {
        if (activeFilters.size === 0) return courses;

        return courses.filter((course) => {
            const courseLecturers = course.lecturers
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean);

            // Check if course matches ANY of the active filters
            const matchesType = activeFilters.has(course.courseType);
            const matchesTerm = activeFilters.has(course.term);
            const matchesLecturer = courseLecturers.some((l) => activeFilters.has(l));
            const matchesKeyword = course.keywords.some((k) => activeFilters.has(k));

            return matchesType || matchesTerm || matchesLecturer || matchesKeyword;
        });
    }, [courses, activeFilters]);

    const displayedCourses = limit ? filteredCourses.slice(0, limit) : filteredCourses;
    const hasMore = limit && filteredCourses.length > limit;

    return (
        <section id="courses" className="section">
            {showHeader && (
                <header className="section-header">
                    <p className="eyebrow">Teaching</p>
                    <h2>Courses</h2>
                    <p>
                        From foundational HCI to advanced electives and seminars, 
                        these courses cover the design, implementation, and evaluation of interactive systems.
                    </p>
                </header>
            )}

            {showFilters && (
                <div className="course-filters">
                    <div className="filter-group">
                        <span className="filter-label">Type</span>
                        {courseTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                className={`filter-tag ${activeFilters.has(type) ? "active" : ""}`}
                                onClick={() => toggleFilter(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Semester</span>
                        {semesters.map((sem) => (
                            <button
                                key={sem}
                                type="button"
                                className={`filter-tag ${activeFilters.has(sem) ? "active" : ""}`}
                                onClick={() => toggleFilter(sem)}
                            >
                                {sem}
                            </button>
                        ))}
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Lecturer</span>
                        {lecturers.map((lecturer) => (
                            <button
                                key={lecturer}
                                type="button"
                                className={`filter-tag ${activeFilters.has(lecturer) ? "active" : ""}`}
                                onClick={() => toggleFilter(lecturer)}
                            >
                                {lecturer}
                            </button>
                        ))}
                    </div>
                    <div className="filter-group">
                        <span className="filter-label">Topic</span>
                        {keywords.map((keyword) => (
                            <button
                                key={keyword}
                                type="button"
                                className={`filter-tag ${activeFilters.has(keyword) ? "active" : ""}`}
                                onClick={() => toggleFilter(keyword)}
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                    {activeFilters.size > 0 && (
                        <button type="button" className="filter-clear" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            <div className="course-grid">
                {displayedCourses.map((course) => (
                    <article key={course.title} className="card course-card">
                        <div className="course-card-body">
                            <h3>
                                <a href={course.url || "#"} target="_blank" rel="noreferrer">
                                    {course.title}
                                </a>
                            </h3>
                            {course.lecturers && (
                                <p className="course-card-lecturers">
                                    {course.lecturers.split(",").map((lecturer, i, arr) => (
                                        <span key={lecturer.trim()}>
                                            <button
                                                type="button"
                                                className={`lecturer-link ${activeFilters.has(lecturer.trim()) ? "active" : ""}`}
                                                onClick={() => toggleFilter(lecturer.trim())}
                                            >
                                                {lecturer.trim()}
                                            </button>
                                            {i < arr.length - 1 && ", "}
                                        </span>
                                    ))}
                                </p>
                            )}
                            <p className="course-card-term">
                                <button
                                    type="button"
                                    className={`term-link ${activeFilters.has(course.term) ? "active" : ""}`}
                                    onClick={() => toggleFilter(course.term)}
                                >
                                    {course.term === "Non-recurring"
                                        ? course.term
                                        : `${course.term} Semester`}
                                </button>
                            </p>
                            {course.courseType && (
                                <button
                                    type="button"
                                    className={`course-card-type ${activeFilters.has(course.courseType) ? "active" : ""}`}
                                    onClick={() => toggleFilter(course.courseType)}
                                >
                                    {course.courseType}
                                </button>
                            )}
                            {course.keywords.length > 0 && (
                                <div className="course-card-keywords">
                                    {course.keywords.map((keyword) => (
                                        <button
                                            key={keyword}
                                            type="button"
                                            className={`keyword-tag ${activeFilters.has(keyword) ? "active" : ""}`}
                                            onClick={() => toggleFilter(keyword)}
                                        >
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {hasMore && (
                <div className="section-footer">
                    <Link href="/courses" className="view-more-btn">
                        View more
                    </Link>
                </div>
            )}

            {displayedCourses.length === 0 && (
                <p className="no-results">No courses match the selected filters.</p>
            )}
        </section>
    );
}
