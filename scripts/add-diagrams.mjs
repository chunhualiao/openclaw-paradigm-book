#!/usr/bin/env node
/**
 * add-diagrams.mjs
 * 
 * Systematically add diagrams to all chapters based on distribution plan
 * Usage: node scripts/add-diagrams.mjs --chapter 01 [--templates <comma-separated>]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const SKILL_DIR = join(REPO_ROOT, '..', '..', 'skills', 'mermaid-book-diagrams');

// Distribution plan: how many diagrams to ADD to each chapter
const DISTRIBUTION = {
  '01': 2, '02': 3, '03': 4, '04': 2, '05': 4, '06': 2, '07': 3,
  '08': 4, '09': 3, '10': 3, '11': 5, '12': 2, '13': 2, '14': 2
};

// All 11 templates to use across chapters
const ALL_TEMPLATES = [
  'architecture', 'flowchart', 'sequence', 'concept-map', 'radial-concept',
  'timeline', 'comparison', 'comparison-table', 'gantt', 'mindmap', 'class-diagram'
];

function parseArgs() {
  const args = process.argv.slice(2);
  const chapter = args.find(a => a.match(/^\d{2}$/)) || args.find((a, i) => args[i-1] === '--chapter');
  const templatesArg = args.find((a, i) => args[i-1] === '--templates');
  const templates = templatesArg ? templatesArg.split(',') : null;
  
  if (!chapter || !DISTRIBUTION[chapter]) {
    console.error('Usage: node add-diagrams.mjs --chapter 01 [--templates architecture,flowchart]');
    console.error('Available chapters:', Object.keys(DISTRIBUTION).join(', '));
    process.exit(1);
  }
  
  return { chapter, templates };
}

function readChapter(chapterNum) {
  const path = join(REPO_ROOT, 'chapters', `chapter-${chapterNum}.md`);
  if (!existsSync(path)) {
    throw new Error(`Chapter file not found: ${path}`);
  }
  return readFileSync(path, 'utf-8');
}

function readExistingContent(chapterNum) {
  const path = join(REPO_ROOT, 'diagrams', `chapter-${chapterNum}`, 'content.json');
  if (!existsSync(path)) {
    throw new Error(`Content file not found: ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function selectTemplates(chapterNum, count, preferredTemplates = null) {
  if (preferredTemplates) {
    return preferredTemplates.slice(0, count);
  }
  
  // Rotate through all 11 templates across chapters
  const offset = parseInt(chapterNum) * count;
  const templates = [];
  for (let i = 0; i < count; i++) {
    templates.push(ALL_TEMPLATES[(offset + i) % ALL_TEMPLATES.length]);
  }
  return templates;
}

function generateDiagramContent(chapterContent, template, diagramNum) {
  // This is a simplified placeholder generator
  // In practice, you'd want AI to analyze chapter content
  const placeholders = {};
  
  switch (template) {
    case 'flowchart':
      placeholders.START_LABEL = 'Start Process';
      placeholders.DECISION_1 = 'Condition Check';
      placeholders.ACTION_1 = 'Execute Action';
      placeholders.END_LABEL = 'Complete';
      placeholders.CHOICE_1_YES = 'Valid';
      placeholders.CHOICE_1_NO = 'Invalid';
      break;
    case 'comparison-table':
      placeholders.OPTION_1_TITLE = 'Traditional Approach';
      placeholders.OPTION_2_TITLE = 'AI-Native Approach';
      placeholders.OPTION_1_CRITERION_1 = 'Feature 1';
      placeholders.OPTION_2_CRITERION_1 = 'Feature 1';
      break;
    // Add more templates as needed
    default:
      placeholders.PLACEHOLDER = 'TODO: Fill content';
  }
  
  return { template, placeholders };
}

async function main() {
  const { chapter, templates: preferredTemplates } = parseArgs();
  const count = DISTRIBUTION[chapter];
  
  console.log(`\n📊 Adding ${count} diagrams to Chapter ${chapter}`);
  
  // Read chapter and existing diagrams
  const chapterContent = readChapter(chapter);
  const existingContent = readExistingContent(chapter);
  const existingCount = existingContent.diagrams.length;
  
  console.log(`   Current diagrams: ${existingCount}`);
  console.log(`   Target total: ${existingCount + count}`);
  
  // Select templates
  const templates = selectTemplates(chapter, count, preferredTemplates);
  console.log(`   Templates: ${templates.join(', ')}`);
  
  // Generate new diagram entries
  const newDiagrams = templates.map((template, i) => {
    return generateDiagramContent(chapterContent, template, existingCount + i + 1);
  });
  
  // Update content.json
  const updatedContent = {
    ...existingContent,
    diagrams: [...existingContent.diagrams, ...newDiagrams]
  };
  
  const contentPath = join(REPO_ROOT, 'diagrams', `chapter-${chapter}`, 'content.json');
  console.log(`\n✏️  Updating ${contentPath}`);
  writeFileSync(contentPath, JSON.stringify(updatedContent, null, 2));
  
  console.log('\n✅ Content updated. Next steps:');
  console.log('   1. Edit content.json to fill in diagram details');
  console.log('   2. Run: node ${SKILL_DIR}/scripts/generate.mjs --content content.json --out diagrams/chapter-${chapter}');
  console.log('   3. Insert diagram references into chapter markdown');
  console.log('   4. Validate word count unchanged');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
