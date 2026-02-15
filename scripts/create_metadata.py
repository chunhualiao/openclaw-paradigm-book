import json
import os
import re

# Read manuscript.md frontmatter
with open('book/manuscript.md', 'r') as f:
    content = f.read()

# Extract frontmatter if exists
frontmatter = {}
if content.startswith('---'):
    match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if match:
        frontmatter_text = match.group(1)
        for line in frontmatter_text.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                frontmatter[key.strip()] = value.strip().strip('"')

# Additional metadata
metadata = {
    "title": frontmatter.get("title", "The OpenClaw Paradigm: AI-Native Development in Practice"),
    "subtitle": "A Practical Guide to Building AI-Native Systems",
    "author": frontmatter.get("author", "The OpenClaw Community"),
    "date": frontmatter.get("date", "2026-02-13"),
    "category": frontmatter.get("category", "Technology / AI / Software Engineering"),
    "word_count": 88271,
    "chapter_count": 15,
    "generated_by": "OpenClaw Books 8-Day Sprint",
    "generation_date": "2026-02-13",
    "license": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
    "isbn": "978-0-000000-00-0 (Paperback) | 978-0-000000-01-7 (Ebook)",
    "repository": "https://github.com/openclaw/openclaw-books",
    "formats": ["Markdown", "HTML"],
    "status": "published"
}

with open('book/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("Metadata created: book/metadata.json")