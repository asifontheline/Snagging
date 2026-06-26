#!/usr/bin/env python3
"""Fetch snagging checklist sources and extract common checklist topics.

Author: asifontheline

This script is intended for periodic review of external snagging references so
that the website checklist can stay aligned with global inspection practices.
"""

import ssl
import urllib.request
from html.parser import HTMLParser

SOURCE_URLS = [
    "https://en.wikipedia.org/wiki/Snagging_(construction)",
    "https://www.homebuilding.co.uk/advice/snagging-checklist",
    "https://www.theguardian.com/money/2018/dec/19/how-to-snag-a-new-home-development",
]

KEYWORDS = [
    "kitchen",
    "bathroom",
    "electrical",
    "plumbing",
    "waterproof",
    "balcony",
    "door",
    "window",
    "certificate",
    "fire",
    "alarm",
    "utility",
    "ventilation",
    "draught",
    "wardrobe",
    "storage",
    "tiling",
    "grout",
    "drainage",
    "lighting",
    "socket",
    "switch",
    "heater",
    "geyser",
    "appliance",
    "manual",
    "warranty",
    "handover",
    "snag",
    "defect",
    "damp",
    "mould",
    "seal",
    "glazing",
    "parking",
    "security",
    "exterior",
    "roof",
    "gutter",
    "meter",
    "waterproofing",
    "gas",
    "smoke",
    "carbon monoxide",
    "emergency lighting",
    "escape route",
]


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []

    def handle_data(self, data):
        self.text_parts.append(data)

    def get_text(self):
        return " ".join(self.text_parts)


def fetch_text(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(url, timeout=20, context=ctx) as response:
        html = response.read().decode("utf-8", errors="ignore")

    extractor = TextExtractor()
    extractor.feed(html)
    return extractor.get_text().lower()


def main():
    print("Snagging checklist external review")
    print("Modules used: ssl, urllib.request, html.parser")
    print("""
This script fetches external snagging resources and identifies common topics.
Run it periodically to compare your checklist against global snagging coverage.
""")

    for url in SOURCE_URLS:
        print(f"\nSource: {url}")
        try:
            text = fetch_text(url)
        except Exception as exc:
            print(f"  ERROR: {exc}")
            continue

        found = sorted({kw for kw in KEYWORDS if kw in text})
        print(f"  Keywords found: {', '.join(found) if found else 'none'}")

        for kw in ["gas", "certificate", "fire", "window", "door", "balcony", "drainage", "warranty", "appliance"]:
            idx = text.find(kw)
            if idx != -1:
                snippet = text[max(0, idx - 60) : idx + 80].replace("\n", " ")
                print(f"    ...{snippet}...")


if __name__ == "__main__":
    main()
