#!/usr/bin/env python3
"""
Script to polish and format the manuscript for 'The OpenClaw Paradigm: AI-Native Development in Practice'
"""

import re
import os
from pathlib import Path

def read_manuscript(file_path):
    """Read the manuscript file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return content

def extract_chapters(content):
    """Extract chapters from manuscript content"""
    # Find all major sections (h1 and h2)
    lines = content.split('\n')
    chapters = []
    current_chapter = None
    current_content = []
    
    for line in lines:
        # Check for h1 headings (starting with # )
        if line.startswith('# '):
            if current_chapter:
                chapters.append({
                    'title': current_chapter,
                    'content': '\n'.join(current_content)
                })
            current_chapter = line[2:].strip()
            current_content = [line]
        elif current_chapter:
            current_content.append(line)
    
    # Add last chapter
    if current_chapter:
        chapters.append({
            'title': current_chapter,
            'content': '\n'.join(current_content)
        })
    
    return chapters

def create_metadata():
    """Create metadata section"""
    metadata = """---
title: The OpenClaw Paradigm: AI-Native Development in Practice
subtitle: A Practical Guide to Building AI-Native Systems
author: OpenClaw Community
publisher: OpenClaw Press
isbn: 978-0-000000-00-0 (Paperback) | 978-0-000000-01-7 (Ebook)
copyright: © 2026 OpenClaw Community. All rights reserved.
license: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
edition: First Edition, February 2026
doi: 10.0000/000000
---
"""
    return metadata

def create_detailed_toc(chapters):
    """Create detailed table of contents with chapter summaries"""
    toc = "# Table of Contents\n\n"
    
    # Add main book sections
    toc += "## Part I: Foundations and Ecosystem (Chapters 1-3)\n"
    toc += "## Part II: Core Patterns and Architecture (Chapters 4-6)\n"
    toc += "## Part III: Operations and Optimization (Chapters 7-9)\n"
    toc += "## Part IV: Security and Future Outlook (Chapters 10-12)\n"
    toc += "## Part V: Tools and Community (Chapters 13-14)\n\n"
    
    toc += "## Detailed Chapter List\n\n"
    
    # Chapter summaries based on the outline
    chapter_summaries = {
        "Introduction: The OpenClaw Paradigm: An Introduction": "Sets the context for AI-native development, defines key concepts, and introduces the OpenClaw platform as a case study.",
        "Chapter 1: Foundations of AI-Native Development": "Establishes core concepts, historical context, and taxonomy of AI-native development patterns.",
        "Chapter 2: The OpenClaw Ecosystem": "Explores OpenClaw architecture, components, deployment models, and community structure.",
        "Chapter 3: Skill Architecture and Patterns": "Examines skill-based architecture, design patterns, and real-world case studies.",
        "Chapter 4: The Soul.md Pattern": "Investigates the philosophy and implementation of agent identity through the Soul.md pattern.",
        "Chapter 5: Multi-Agent Orchestration Patterns": "Analyzes patterns for coordinating multiple AI agents in complex workflows.",
        "Chapter 6: File Coordination and Memory Patterns": "Explores file-based approaches to state management and memory in AI systems.",
        "Chapter 7: Cron, Heartbeats, and Autonomous Operations": "Examines patterns for scheduled automation and autonomous system operations.",
        "Chapter 8: Advanced Tooling and APIs": "Surveys the tooling ecosystem and API integration patterns.",
        "Chapter 9: Cost Optimization and Resource Management": "Investigates patterns for managing API costs and resource consumption.",
        "Chapter 10: Debugging AI-Native Systems": "Explores debugging patterns, error recovery, and system monitoring.",
        "Chapter 11: Security and OPSEC in AI-Native Development": "Examines security considerations, privacy patterns, and operational security.",
        "Chapter 12: The Future of AI-Native Development": "Looks ahead at emerging trends, challenges, and future directions.",
        "Chapter 13: Tools, Frameworks, and Infrastructure": "Surveys development tools, frameworks, and infrastructure patterns.",
        "Chapter 14: Education and Community Building": "Explores education resources, community patterns, and contribution guidelines."
    }
    
    for i, chapter in enumerate(chapters):
        title = chapter['title']
        if title in chapter_summaries:
            summary = chapter_summaries[title]
            toc += f"### {title}\n"
            toc += f"*Summary: {summary}*\n\n"
    
    return toc

def normalize_formatting(content):
    """Normalize formatting throughout the manuscript"""
    # Standardize list markers (use - instead of *)
    content = re.sub(r'^\*\s+', '- ', content, flags=re.MULTILINE)
    
    # Standardize emphasis (use ** for strong emphasis)
    content = re.sub(r'\*\*(.*?)\*\*', r'**\1**', content)  # Ensure consistent
    
    # Standardize code blocks (ensure proper spacing)
    content = re.sub(r'```\s*\n', '```\n', content)
    content = re.sub(r'\n```', '\n```', content)
    
    # Standardize headings (ensure consistent spacing)
    content = re.sub(r'^(#{1,6})\s*(.+)$', r'\1 \2', content, flags=re.MULTILINE)
    
    return content

def create_index():
    """Create comprehensive index of topics"""
    index = """# Index

## A
- AI-Augmented Development
- AI-First Contribution Pattern
- AI-Native Development
- Append-Only History Pattern
- Autonomous Systems
- Architecture Patterns

## B
- Backward Compatibility
- Browser Control

## C
- Channels (Discord, Telegram, CLI)
- Code Blocks
- Community Building
- Cost Optimization
- Cron Patterns

## D
- Debugging Patterns
- Development Tools

## E
- Error Recovery Patterns
- Example-Driven Development
- Extensibility

## F
- File-Based Memory Pattern
- File Coordination
- Foundation Models

## G
- Gateway Architecture
- Gateway-Mediated Multi-Agent Pattern
- Guardrail-First Safety Pattern

## H
- Health-Check Skill
- Heartbeat Patterns
- Human-Centric Design

## I
- Identity Patterns (Soul.md)
- Index (this section)
- Integration Patterns

## J
- JSON Configuration

## K
- Key Management
- Knowledge Base

## L
- Large Language Models (LLMs)
- Learning Resources
- Load Balancing

## M
- Memory Patterns
- Micro-Skill Architecture
- Multi-Agent Orchestration
- Monitoring Patterns

## N
- Natural Language Interfaces
- Node Management

## O
- OpenClaw Architecture
- Open Source Community
- OPSEC (Operational Security)
- Orchestration Patterns

## P
- Pattern Synthesis
- Permission-Based Tools
- Privacy by Design
- Progressive Summarization

## Q
- Quality Assurance
- Query Optimization

## R
- Research Methodology
- Resource Management
- Resilience Patterns

## S
- Scheduled Automation
- Security Patterns
- Session Management
- Skill Architecture
- Skill Blueprint Pattern
- Soul.md Pattern
- State Persistence

## T
- Taxonomy of AI-Native Development
- Tool-Based Error Recovery
- Tooling Ecosystem
- Tool-First Design

## U
- User Experience
- User Interface

## V
- Validation Patterns
- Version Control

## W
- Web Fetch
- Workflow Patterns

## X
- XML Configuration (rare)

## Y
- YAML Configuration

## Z
- Zero-Trust Architecture
- Zone Management
"""
    return index

def main():
    """Main processing function"""
    manuscript_path = Path("book/manuscript.md")
    output_path = Path("book/final-manuscript.md")
    
    print(f"Reading manuscript from {manuscript_path}")
    content = read_manuscript(manuscript_path)
    
    print("Extracting chapters...")
    chapters = extract_chapters(content)
    
    print("Creating metadata...")
    metadata = create_metadata()
    
    print("Creating detailed table of contents...")
    toc = create_detailed_toc(chapters)
    
    print("Normalizing formatting...")
    normalized_content = normalize_formatting(content)
    
    print("Creating index...")
    index = create_index()
    
    print("Assembling final manuscript...")
    final_content = metadata + "\n\n" + toc + "\n\n" + normalized_content + "\n\n" + index
    
    print(f"Writing final manuscript to {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print("Done!")
    
    # Count words
    word_count = len(final_content.split())
    print(f"Final word count: {word_count}")

if __name__ == "__main__":
    main()