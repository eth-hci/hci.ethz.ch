#!/usr/bin/env python3
"""
Pull publications from DBLP for a given author.

Usage:
    python dblp_pull.py "Author Name"
    python dblp_pull.py --pid "123/4567"  # Use DBLP person ID directly

Output: publications_pull.csv in the data/ directory
"""

import argparse
import csv
import re
import ssl
import sys
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

# Create SSL context that doesn't verify certificates (for macOS compatibility)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


def fetch_dblp_by_name(author_name: str) -> str:
    """Search DBLP by author name and return XML content."""
    # Use DBLP search API
    encoded_name = urllib.parse.quote(author_name)
    url = f"https://dblp.org/search/author/api?q={encoded_name}&format=xml"
    
    with urllib.request.urlopen(url, timeout=30, context=ssl_context) as response:
        return response.read().decode("utf-8")


def fetch_dblp_by_pid(pid: str) -> str:
    """Fetch DBLP publications by person ID."""
    url = f"https://dblp.org/pid/{pid}.xml"
    
    with urllib.request.urlopen(url, timeout=30, context=ssl_context) as response:
        return response.read().decode("utf-8")


def get_author_pid_from_search(xml_content: str, author_name: str) -> str | None:
    """Extract the best matching author PID from search results."""
    root = ET.fromstring(xml_content)
    
    # Find hits
    hits = root.find("hits")
    if hits is None:
        return None
    
    for hit in hits.findall("hit"):
        info = hit.find("info")
        if info is None:
            continue
        
        author_elem = info.find("author")
        url_elem = info.find("url")
        
        if author_elem is not None and url_elem is not None:
            found_name = author_elem.text or ""
            # Check if name matches (case-insensitive)
            if author_name.lower() in found_name.lower():
                # Extract PID from URL like https://dblp.org/pid/123/4567
                url = url_elem.text or ""
                match = re.search(r"/pid/(.+)$", url)
                if match:
                    return match.group(1)
    
    return None


def parse_publications(xml_content: str) -> list[dict]:
    """Parse DBLP XML and extract publications."""
    root = ET.fromstring(xml_content)
    publications = []
    
    # Find all publication entries
    pub_types = ["article", "inproceedings", "proceedings", "book", "incollection", "phdthesis", "mastersthesis"]
    
    for pub_type in pub_types:
        for pub in root.iter(pub_type):
            pub_data = parse_single_publication(pub, pub_type)
            if pub_data:
                publications.append(pub_data)
    
    return publications


def parse_single_publication(pub: ET.Element, pub_type: str) -> dict | None:
    """Parse a single publication element."""
    # Get key attribute for ID
    key = pub.get("key", "")
    if not key:
        return None
    
    # Generate a clean ID from the key
    pub_id = key.replace("/", "_").replace(":", "_").lower()
    
    # Extract title
    title_elem = pub.find("title")
    title = ""
    if title_elem is not None:
        # Handle nested elements in title
        title = "".join(title_elem.itertext()).strip()
    
    if not title:
        return None
    
    # Extract authors
    authors = []
    for author in pub.findall("author"):
        if author.text:
            authors.append(author.text)
    
    # Extract venue - check multiple possible elements
    venue = ""
    for venue_tag in ["journal", "booktitle", "publisher", "school"]:
        venue_elem = pub.find(venue_tag)
        if venue_elem is not None:
            # Handle nested elements (like <i> tags) in venue
            venue = "".join(venue_elem.itertext()).strip()
            if venue:
                break
    
    # Extract year
    year_elem = pub.find("year")
    year = year_elem.text if year_elem is not None else ""
    
    # Extract pages
    pages_elem = pub.find("pages")
    pages = pages_elem.text if pages_elem is not None else ""
    
    # Extract URL/DOI
    url = ""
    ee_elem = pub.find("ee")
    if ee_elem is not None:
        url = ee_elem.text or ""
    
    return {
        "id": pub_id,
        "type": pub_type,
        "title": title,
        "authors": "; ".join(authors),
        "venue": venue,
        "year": year,
        "pages": pages,
        "url": url,
    }


def write_csv(publications: list[dict], output_path: Path) -> None:
    """Write publications to CSV file."""
    fieldnames = ["id", "type", "title", "authors", "venue", "year", "pages", "url"]
    
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(publications)
    
    print(f"Wrote {len(publications)} publications to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Pull publications from DBLP")
    parser.add_argument("author", nargs="?", help="Author name to search for")
    parser.add_argument("--pid", help="DBLP person ID (e.g., '123/4567')")
    parser.add_argument("--output", "-o", default="publications_pull.csv", help="Output filename")
    
    args = parser.parse_args()
    
    if not args.author and not args.pid:
        parser.error("Either author name or --pid is required")
    
    # Determine output path
    script_dir = Path(__file__).parent
    data_dir = script_dir.parent
    output_path = data_dir / args.output
    
    try:
        if args.pid:
            print(f"Fetching publications for PID: {args.pid}")
            xml_content = fetch_dblp_by_pid(args.pid)
        else:
            print(f"Searching for author: {args.author}")
            search_xml = fetch_dblp_by_name(args.author)
            
            pid = get_author_pid_from_search(search_xml, args.author)
            if not pid:
                print(f"Error: Could not find author '{args.author}' on DBLP")
                sys.exit(1)
            
            print(f"Found author with PID: {pid}")
            xml_content = fetch_dblp_by_pid(pid)
        
        publications = parse_publications(xml_content)
        
        if not publications:
            print("No publications found")
            sys.exit(1)
        
        # Sort by year descending
        publications.sort(key=lambda x: x.get("year", "0"), reverse=True)
        
        write_csv(publications, output_path)
        
    except urllib.error.URLError as e:
        print(f"Error fetching from DBLP: {e}")
        sys.exit(1)
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
