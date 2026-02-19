"use client";

import { useState, useMemo } from "react";
import type { Course } from "../lib/types";
import CoursesSection from "./CoursesSection";

type Props = {
  courses: Course[];
};

type ViewMode = "list" | "calendar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

function parseTime(timeStr: string): { start: number; end: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const startHour = parseInt(match[1], 10);
  const startMin = parseInt(match[2], 10);
  const endHour = parseInt(match[3], 10);
  const endMin = parseInt(match[4], 10);
  return {
    start: startHour + startMin / 60,
    end: endHour + endMin / 60,
  };
}

function parseSessions(course: Course): Array<{
  day: string;
  time: string;
  location: string;
  start: number;
  end: number;
}> {
  const days = course.day.split("; ").filter(Boolean);
  const times = course.time.split("; ").filter(Boolean);
  const locations = course.location.split("; ").filter(Boolean);

  const sessions: Array<{
    day: string;
    time: string;
    location: string;
    start: number;
    end: number;
  }> = [];

  for (let i = 0; i < Math.max(days.length, times.length); i++) {
    const day = days[i] || days[0] || "";
    const time = times[i] || times[0] || "";
    const location = locations[i] || locations[0] || "";
    const parsed = parseTime(time);

    if (day && parsed) {
      sessions.push({
        day,
        time,
        location,
        start: parsed.start,
        end: parsed.end,
      });
    }
  }

  return sessions;
}

type CalendarEvent = {
  course: Course;
  day: string;
  time: string;
  location: string;
  start: number;
  end: number;
};

type LayoutEvent = CalendarEvent & {
  column: number;
  totalColumns: number;
};

function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  return a.start < b.end && b.start < a.end;
}

function calculateLayout(events: CalendarEvent[]): LayoutEvent[] {
  if (events.length === 0) return [];

  // Sort by start time, then by end time
  const sorted = [...events].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return a.end - b.end;
  });

  const layoutEvents: LayoutEvent[] = sorted.map((e) => ({
    ...e,
    column: 0,
    totalColumns: 1,
  }));

  // Find overlapping groups and assign columns
  for (let i = 0; i < layoutEvents.length; i++) {
    const overlapping = layoutEvents.filter(
      (e, j) => j < i && eventsOverlap(layoutEvents[i], e)
    );

    if (overlapping.length > 0) {
      // Find the first available column
      const usedColumns = new Set(overlapping.map((e) => e.column));
      let col = 0;
      while (usedColumns.has(col)) col++;
      layoutEvents[i].column = col;
    }
  }

  // Calculate total columns for each overlapping group
  for (let i = 0; i < layoutEvents.length; i++) {
    const overlapping = layoutEvents.filter((e, j) =>
      i !== j && eventsOverlap(layoutEvents[i], e)
    );
    const maxCol = Math.max(
      layoutEvents[i].column,
      ...overlapping.map((e) => e.column)
    );
    layoutEvents[i].totalColumns = maxCol + 1;
    for (const e of overlapping) {
      e.totalColumns = Math.max(e.totalColumns, maxCol + 1);
    }
  }

  return layoutEvents;
}

export default function CoursesPageClient({ courses }: Props) {
  const [view, setView] = useState<ViewMode>("list");
  const [semester, setSemester] = useState<"Autumn" | "Spring">("Spring");
  const [tooltip, setTooltip] = useState<{
    event: LayoutEvent;
    x: number;
    y: number;
  } | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => c.term === semester || c.term === "Non-recurring");
  }, [courses, semester]);

  // Get calendar events
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    for (const course of filteredCourses) {
      const sessions = parseSessions(course);
      for (const session of sessions) {
        events.push({ course, ...session });
      }
    }

    return events;
  }, [filteredCourses]);

  // Group events by day with layout calculation
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, LayoutEvent[]> = {};
    for (const day of DAYS) {
      const dayEvents = calendarEvents.filter((e) => e.day === day);
      grouped[day] = calculateLayout(dayEvents);
    }
    return grouped;
  }, [calendarEvents]);

  // Courses without schedule data
  const unscheduledCourses = useMemo(() => {
    return filteredCourses.filter((course) => {
      const sessions = parseSessions(course);
      return sessions.length === 0;
    });
  }, [filteredCourses]);

  return (
    <section className="section">
      <header className="section-header">
        <p className="eyebrow">Teaching</p>
        <h2>Courses</h2>
        <p>
          From foundational HCI to advanced electives and seminars, these
          courses cover the design, implementation, and evaluation of
          interactive systems.
        </p>
      </header>

      <div className="courses-tabs">
        <div className="tab-buttons">
          <button
            type="button"
            className={`tab-button ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            List View
          </button>
          <button
            type="button"
            className={`tab-button ${view === "calendar" ? "active" : ""}`}
            onClick={() => setView("calendar")}
          >
            Calendar View
          </button>
        </div>

        {view === "calendar" && (
          <div className="semester-toggle">
            <button
              type="button"
              className={`semester-button ${semester === "Autumn" ? "active" : ""}`}
              onClick={() => setSemester("Autumn")}
            >
              Autumn
            </button>
            <button
              type="button"
              className={`semester-button ${semester === "Spring" ? "active" : ""}`}
              onClick={() => setSemester("Spring")}
            >
              Spring
            </button>
          </div>
        )}
      </div>

      {view === "list" ? (
        <CoursesSection courses={courses} showFilters={true} showHeader={false} />
      ) : (
        <div className="calendar-view">
          <div className="calendar-grid">
            {/* Time column */}
            <div className="calendar-times">
              <div className="calendar-header-cell" />
              {HOURS.map((hour) => (
                <div key={hour} className="calendar-time-cell">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((day) => (
              <div key={day} className="calendar-day-column">
                <div className="calendar-header-cell">{day}</div>
                <div className="calendar-day-body">
                  {eventsByDay[day].map((event, idx) => {
                    const top = (event.start - 8) * 60;
                    const height = (event.end - event.start) * 60;
                    const width = 100 / event.totalColumns;
                    const left = (event.column / event.totalColumns) * 100;
                    return (
                      <a
                        key={`${event.course.title}-${idx}`}
                        href={event.course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="calendar-event"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          width: `calc(${width}% - 4px)`,
                          left: `calc(${left}% + 2px)`,
                        }}
                        onMouseEnter={(e) =>
                          setTooltip({ event, x: e.clientX, y: e.clientY })
                        }
                        onMouseMove={(e) =>
                          setTooltip({ event, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <span className="calendar-event-title">
                          {event.course.title}
                        </span>
                        <span className="calendar-event-time">{event.time}</span>
                        <span className="calendar-event-location">
                          {event.location}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {unscheduledCourses.length > 0 && (
            <div className="unscheduled-courses">
              <h3>Not on Calendar</h3>
              <p className="unscheduled-note">
                These courses meet on specific dates rather than weekly, so they can&apos;t be shown in the calendar view.
              </p>
              <ul className="unscheduled-list">
                {unscheduledCourses.map((course) => (
                  <li key={course.title}>
                    <a href={course.url} target="_blank" rel="noreferrer">
                      {course.title}
                    </a>
                    {course.lecturers && (
                      <span className="unscheduled-lecturers">
                        {course.lecturers}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tooltip && (
            <div
              className="calendar-tooltip"
              style={{
                left: `${tooltip.x + 12}px`,
                top: `${tooltip.y + 12}px`,
              }}
            >
              <strong>{tooltip.event.course.title}</strong>
              <span>{tooltip.event.time}</span>
              <span>{tooltip.event.location}</span>
              {tooltip.event.course.lecturers && (
                <span>{tooltip.event.course.lecturers}</span>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
