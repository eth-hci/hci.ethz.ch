#!/usr/bin/env python3
"""
Fetch course schedule information from ETH VVZ pages.
Extracts day, time, and location for each course.
Handles courses with multiple sessions per week.
"""

import csv
import re
import ssl
import urllib.request
from pathlib import Path


def fetch_page(url: str) -> str:
    """Fetch a web page with SSL handling for macOS."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
    )
    
    with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def parse_schedule(html: str) -> list[dict]:
    """
    Parse all schedule sessions from VVZ HTML.
    Returns list of dicts with day, time, location for each session.
    """
    sessions = []
    
    # Find nested schedule tables
    # Pattern: <td class="td-small">Day</td><td class="td-small">Time</td><td class="td-small">Room</td>
    
    # Day abbreviations in links
    day_pattern = r'popUp\(\'Lehrveranstaltung\'\);"?>([A-Za-z]{2,3})</a></td>'
    time_pattern = r'popUp\(\'Anfangszeit\'\);">(\d{1,2}:\d{2}-\d{1,2}:\d{2})</a></td>'
    # Building is in rel="map", room is in rel="geb"
    building_pattern = r'rel="map"\s*>([A-Z]{2,4})</a>'
    room_pattern = r'rel="geb"\s*>([A-Z]?\s*\d+(?:\.\d+)?)</a>'
    
    # Find all nested table rows
    nested_tables = re.findall(r'<table class="nested"[^>]*>(.*?)</table>', html, re.DOTALL)
    
    for table in nested_tables:
        rows = re.findall(r'<tr>(.*?)</tr>', table, re.DOTALL)
        
        for row in rows:
            day_match = re.search(day_pattern, row)
            time_match = re.search(time_pattern, row)
            building_match = re.search(building_pattern, row)
            room_match = re.search(room_pattern, row)
            
            if day_match and time_match:
                day_abbr = day_match.group(1).lower()
                day_map = {
                    'mo': 'Mon', 'mon': 'Mon',
                    'di': 'Tue', 'tue': 'Tue',
                    'mi': 'Wed', 'wed': 'Wed',
                    'do': 'Thu', 'thu': 'Thu',
                    'fr': 'Fri', 'fri': 'Fri',
                    'sa': 'Sat', 'sat': 'Sat',
                    'so': 'Sun', 'sun': 'Sun',
                }
                day = day_map.get(day_abbr, day_abbr.capitalize())
                time = time_match.group(1)
                
                # Combine building and room
                building = building_match.group(1) if building_match else ""
                room = room_match.group(1) if room_match else ""
                location = f"{building} {room}".strip() if building else room
                
                # Avoid duplicates
                session = {"day": day, "time": time, "location": location}
                if session not in sessions:
                    sessions.append(session)
    
    return sessions


def format_sessions(sessions: list[dict]) -> tuple[str, str, str]:
    """
    Format multiple sessions into CSV-friendly strings.
    Returns (days, times, locations) with semicolon separators.
    """
    if not sessions:
        return ("", "", "")
    
    # Combine sessions: "Thu 10:15-12:00; Fri 13:15-14:00"
    days = "; ".join(s["day"] for s in sessions)
    times = "; ".join(s["time"] for s in sessions)
    locations = "; ".join(s["location"] for s in sessions if s["location"])
    
    return (days, times, locations)


def update_courses_csv():
    """Update courses.csv with schedule information."""
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent
    courses_file = data_dir / "courses.csv"
    output_file = data_dir / "courses_updated.csv"
    
    # Read existing courses
    with open(courses_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames)
        courses = list(reader)
    
    # Add new columns if not present
    new_fields = ["day", "time", "location"]
    for field in new_fields:
        if field not in fieldnames:
            fieldnames.append(field)
    
    # Process each course
    for course in courses:
        url = course.get("url", "")
        if not url:
            continue
            
        print(f"Fetching: {course.get('name', 'Unknown')[:50]}...")
        
        try:
            html = fetch_page(url)
            sessions = parse_schedule(html)
            days, times, locations = format_sessions(sessions)
            
            # Update course with schedule info
            course["day"] = days
            course["time"] = times
            course["location"] = locations
            
            if sessions:
                for s in sessions:
                    print(f"  → {s['day']} {s['time']} @ {s['location']}")
            else:
                print(f"  → No schedule found")
                
        except Exception as e:
            print(f"  → Error: {e}")
    
    # Write updated CSV
    with open(output_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(courses)
    
    print(f"\nUpdated courses saved to: {output_file}")
    print("Review the file and rename to courses.csv if correct.")


if __name__ == "__main__":
    update_courses_csv()
