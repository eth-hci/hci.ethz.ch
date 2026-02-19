"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Publication } from "../lib/types";

type Props = {
  publications: Publication[];
  limit?: number;
  showFilters?: boolean;
};

export default function PublicationsSection({
  publications,
  limit,
  showFilters = true,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  // Extract unique filter options
  const years = useMemo(
    () =>
      Array.from(new Set(publications.map((p) => p.year).filter(Boolean))).sort(
        (a, b) => Number(b) - Number(a)
      ),
    [publications]
  );

  const venues = useMemo(() => {
    const all = publications.map((p) => p.venue).filter(Boolean);
    return Array.from(new Set(all)).sort();
  }, [publications]);

  const authors = useMemo(() => {
    const all = publications.flatMap((p) =>
      p.authors
        .split(";")
        .map((a) => a.trim())
        .filter(Boolean)
    );
    // Count occurrences and sort by frequency
    const counts = all.reduce<Record<string, number>>((acc, a) => {
      acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30) // Top 30 authors
      .map(([name]) => name);
  }, [publications]);

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

  // Filter publications
  const filteredPubs = useMemo(() => {
    if (activeFilters.size === 0) return publications;

    return publications.filter((pub) => {
      const pubAuthors = pub.authors
        .split(";")
        .map((a) => a.trim())
        .filter(Boolean);

      const matchesYear = activeFilters.has(pub.year);
      const matchesVenue = activeFilters.has(pub.venue);
      const matchesAuthor = pubAuthors.some((a) => activeFilters.has(a));

      return matchesYear || matchesVenue || matchesAuthor;
    });
  }, [publications, activeFilters]);

  // Apply limit after filtering
  const displayedPubs = limit ? filteredPubs.slice(0, limit) : filteredPubs;
  const hasMore = limit && filteredPubs.length > limit;

  // Group publications by year
  const byYear = displayedPubs.reduce<Record<string, Publication[]>>(
    (acc, pub) => {
      const year = pub.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    },
    {}
  );

  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section id="publications" className="section">
      <header className="section-header">
        <p className="eyebrow">Research</p>
        <h2>Publications</h2>
        <p>Selected publications from HCI research groups at ETH Zurich.</p>
      </header>

      {showFilters && (
        <div className="course-filters">
          <div className="filter-group">
            <span className="filter-label">Year</span>
            {years.slice(0, 10).map((year) => (
              <button
                key={year}
                type="button"
                className={`filter-tag ${activeFilters.has(year) ? "active" : ""}`}
                onClick={() => toggleFilter(year)}
              >
                {year}
              </button>
            ))}
          </div>
          {/* Show selected venues */}
          {Array.from(activeFilters).filter((f) => venues.includes(f)).length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Venue</span>
              {Array.from(activeFilters)
                .filter((f) => venues.includes(f))
                .map((venue) => (
                  <button
                    key={venue}
                    type="button"
                    className="filter-tag active"
                    onClick={() => toggleFilter(venue)}
                  >
                    {venue} ×
                  </button>
                ))}
            </div>
          )}
          {/* Show selected authors */}
          {Array.from(activeFilters).filter((f) => !years.includes(f) && !venues.includes(f)).length > 0 && (
            <div className="filter-group">
              <span className="filter-label">Author</span>
              {Array.from(activeFilters)
                .filter((f) => !years.includes(f) && !venues.includes(f))
                .map((author) => (
                  <button
                    key={author}
                    type="button"
                    className="filter-tag active"
                    onClick={() => toggleFilter(author)}
                  >
                    {author} ×
                  </button>
                ))}
            </div>
          )}
          {activeFilters.size > 0 && (
            <button
              type="button"
              className="filter-clear"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="publications-list">
        {sortedYears.map((year) => (
          <div key={year} className="publications-year-group">
            <h3 className="publications-year">{year}</h3>
            <ul className="publications-items">
              {byYear[year].map((pub) => (
                <li key={pub.id} className="publication-item">
                  <p className="publication-title">
                    {pub.url ? (
                      <a href={pub.url} target="_blank" rel="noreferrer">
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </p>
                  <p className="publication-authors">
                    {pub.authors
                      .split(";")
                      .map((author, i, arr) => (
                        <span key={author.trim()}>
                          <button
                            type="button"
                            className={`author-link ${activeFilters.has(author.trim()) ? "active" : ""}`}
                            onClick={() => toggleFilter(author.trim())}
                          >
                            {author.trim()}
                          </button>
                          {i < arr.length - 1 && "; "}
                        </span>
                      ))}
                  </p>
                  <p className="publication-venue">
                    <button
                      type="button"
                      className={`venue-link ${activeFilters.has(pub.venue) ? "active" : ""}`}
                      onClick={() => toggleFilter(pub.venue)}
                    >
                      {pub.venue}
                    </button>
                    {pub.year && (
                      <>
                        ,{" "}
                        <button
                          type="button"
                          className={`year-link ${activeFilters.has(pub.year) ? "active" : ""}`}
                          onClick={() => toggleFilter(pub.year)}
                        >
                          {pub.year}
                        </button>
                      </>
                    )}
                    {pub.pages && `, pp. ${pub.pages}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {displayedPubs.length === 0 && (
        <p className="no-results">No publications match the selected filters.</p>
      )}

      {hasMore && (
        <div className="section-footer">
          <Link href="/publications" className="view-more-btn">
            View more
          </Link>
        </div>
      )}
    </section>
  );
}
