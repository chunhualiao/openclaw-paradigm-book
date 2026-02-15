
import os
import re

def clean_content(text):
    # Remove excessive blank lines at start and end
    text = text.strip()
    # Normalize headers if needed, but here we trust the files mostly
    return text

def get_chapter_title(content):
    match = re.search(r'^# (Chapter \d+:.+)', content, re.MULTILINE)
    if not match:
        match = re.search(r'^# (Introduction:.+)', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "Unknown Chapter"

# Define the sequence
files = [
    'chapters/introduction.md',
    'chapters/chapter-01.md',
    'chapters/chapter-02.md',
    'chapters/chapter-03-fixed.md',
    'chapters/chapter-04.md',
    'chapters/chapter-05.md',
    'chapters/chapter-06.md',
    'chapters/chapter-07.md',
    'chapters/chapter-08.md',
    'chapters/chapter-09.md',
    'chapters/chapter-10.md',
    'chapters/chapter-11.md',
    'chapters/chapter-12.md',
    'chapters/chapter-13.md',
    'chapters/chapter-14.md',
]

frontmatter = """---
title: "The OpenClaw Paradigm: AI-Native Development in Practice"
author: "The OpenClaw Community"
date: "2026-02-13"
category: "Technology / AI / Software Engineering"
---

# The OpenClaw Paradigm: AI-Native Development in Practice

## Table of Contents
"""

full_content = ""
toc = ""

for f in files:
    if not os.path.exists(f):
        print(f"File {f} not found!")
        continue
    
    with open(f, 'r') as file:
        content = file.read()
    
    title = get_chapter_title(content)
    # Create anchor: chapter-1-foundations-of-ai-native-development
    anchor = title.lower().replace(':','').replace('.','').replace(' ','-')
    
    toc += f"- [{title}](#{anchor})\n"
    
    # Ensure the title has the anchor
    clean = clean_content(content)
    # Replace first # Title with # Title {#anchor} if not already there
    # Markdown-style anchors are usually just handled by the title, but we can be explicit if needed.
    # We will just ensure the content starts with a fresh page (---) in some viewers
    
    full_content += "\n---\n\n" + clean + "\n"

# Combine it all
final_manuscript = frontmatter + toc + "\n" + full_content

with open('book/manuscript.md', 'w') as f:
    f.write(final_manuscript)

print(f"Unified manuscript written to book/manuscript.md. Words: {len(final_manuscript.split())}")
