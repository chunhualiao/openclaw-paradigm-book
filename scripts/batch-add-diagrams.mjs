#!/usr/bin/env node
/**
 * batch-add-diagrams.mjs
 * 
 * Batch add diagrams to all remaining chapters based on distribution plan
 * Generates content.json files for all chapters 3-14
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = '/Users/username/.openclaw/workspace/openclaw-books';

// Template assignments for each chapter (templates to ADD, not replace)
const CHAPTER_TEMPLATES = {
  '03': ['class-diagram', 'radial-concept', 'comparison', 'timeline'],
  '04': ['flowchart', 'comparison-table'],
  '05': ['architecture', 'sequence', 'gantt', 'mindmap'],
  '06': ['class-diagram', 'radial-concept'],
  '07': ['timeline', 'comparison', 'flowchart'],
  '08': ['sequence', 'comparison-table', 'gantt', 'architecture'],
  '09': ['mindmap', 'class-diagram', 'radial-concept'],
  '10': ['timeline', 'flowchart', 'comparison'],
  '11': ['sequence', 'architecture', 'comparison-table', 'gantt', 'mindmap'],
  '12': ['class-diagram', 'radial-concept'],
  '13': ['timeline', 'flowchart'],
  '14': ['comparison', 'sequence']
};

// Generic placeholder generators for each template type
const PLACEHOLDERS = {
  'class-diagram': {
    CLASS_1_NAME: 'Agent',
    CLASS_1_ATTR_1: 'personality',
    CLASS_1_ATTR_2: 'memory',
    CLASS_1_ATTR_3: 'skills',
    CLASS_1_METHOD_1: 'process()',
    CLASS_1_METHOD_2: 'respond()',
    CLASS_1_METHOD_3: 'learn()',
    CLASS_2_NAME: 'Skill',
    CLASS_2_ATTR_1: 'name',
    CLASS_2_ATTR_2: 'triggers',
    CLASS_2_ATTR_3: 'guardrails',
    CLASS_2_METHOD_1: 'execute()',
    CLASS_2_METHOD_2: 'validate()',
    CLASS_2_METHOD_3: 'report()',
    CLASS_3_NAME: 'Tool',
    CLASS_3_ATTR_1: 'type',
    CLASS_3_ATTR_2: 'policy',
    CLASS_3_ATTR_3: 'status',
    CLASS_3_METHOD_1: 'invoke()',
    CLASS_3_METHOD_2: 'check()',
    CLASS_3_METHOD_3: 'log()',
    REL_1_TYPE: 'composition',
    REL_1_LABEL: 'uses',
    REL_2_TYPE: 'inheritance',
    REL_2_LABEL: 'extends',
    REL_3_TYPE: 'association',
    REL_3_LABEL: 'interacts'
  },
  'radial-concept': {
    CENTRAL_CONCEPT: 'Core Pattern',
    LEVEL_1_LABEL: 'Principles',
    LEVEL_1_NODE_1: 'Pragmatism',
    LEVEL_1_NODE_2: 'Human-Centric',
    LEVEL_1_NODE_3: 'Composability',
    LEVEL_2_LABEL: 'Implementation',
    LEVEL_2_NODE_1: 'File-Based',
    LEVEL_2_NODE_2: 'Tool-Oriented',
    LEVEL_2_NODE_3: 'Example-Driven',
    LEVEL_3_LABEL: 'Practices',
    LEVEL_3_NODE_1: 'Documentation',
    LEVEL_3_NODE_2: 'Testing',
    LEVEL_3_NODE_3: 'Collaboration',
    LEVEL_4_LABEL: 'Community',
    LEVEL_4_NODE_1: 'Open Source',
    LEVEL_4_NODE_2: 'Contribution',
    LEVEL_4_NODE_3: 'Evolution'
  },
  'comparison': {
    COMPARISON_TITLE: 'System Comparison',
    X_AXIS_LOW: 'Simple',
    X_AXIS_HIGH: 'Complex',
    Y_AXIS_LOW: 'Manual',
    Y_AXIS_HIGH: 'Automated',
    QUADRANT_1_LABEL: 'Ideal Zone',
    QUADRANT_2_LABEL: 'Advanced',
    QUADRANT_3_LABEL: 'Basic',
    QUADRANT_4_LABEL: 'Intermediate',
    ITEM_1: 'Option A',
    X_1: 0.3,
    Y_1: 0.4,
    ITEM_2: 'Option B',
    X_2: 0.6,
    Y_2: 0.7,
    ITEM_3: 'Option C',
    X_3: 0.8,
    Y_3: 0.5,
    ITEM_4: 'Option D',
    X_4: 0.4,
    Y_4: 0.8,
    ITEM_5: 'Option E',
    X_5: 0.2,
    Y_5: 0.3
  },
  'timeline': {
    TIMELINE_TITLE: 'Process Timeline',
    PHASE_1: 'Phase 1',
    EVENT_1_1: 'Step 1',
    EVENT_1_1_DESC: 'Initial Setup',
    EVENT_1_2: 'Step 2',
    EVENT_1_2_DESC: 'Configuration',
    PHASE_2: 'Phase 2',
    EVENT_2_1: 'Step 3',
    EVENT_2_1_DESC: 'Implementation',
    EVENT_2_2: 'Step 4',
    EVENT_2_2_DESC: 'Testing',
    PHASE_3: 'Phase 3',
    EVENT_3_1: 'Step 5',
    EVENT_3_1_DESC: 'Deployment',
    EVENT_3_2: 'Step 6',
    EVENT_3_2_DESC: 'Monitoring'
  },
  'flowchart': {
    START_LABEL: 'Start',
    DECISION_1: 'Check Condition',
    CHOICE_1_YES: 'Proceed',
    CHOICE_1_NO: 'Retry',
    DECISION_2: 'Validate',
    CHOICE_2_YES: 'Success',
    CHOICE_2_NO: 'Error',
    ACTION_1: 'Process Data',
    ACTION_2: 'Execute Task',
    ACTION_3: 'Log Result',
    ACTION_4: 'Cleanup',
    END_LABEL: 'Complete'
  },
  'comparison-table': {
    OPTION_1_TITLE: 'Approach A',
    OPTION_2_TITLE: 'Approach B',
    OPTION_1_CRITERION_1: 'Speed: Fast',
    OPTION_2_CRITERION_1: 'Speed: Moderate',
    OPTION_1_CRITERION_2: 'Cost: High',
    OPTION_2_CRITERION_2: 'Cost: Low',
    OPTION_1_CRITERION_3: 'Complexity: Simple',
    OPTION_2_CRITERION_3: 'Complexity: Moderate',
    OPTION_1_CRITERION_4: 'Scalability: Limited',
    OPTION_2_CRITERION_4: 'Scalability: Excellent'
  },
  'architecture': {
    SYSTEM_NAME: 'System Architecture',
    COMPONENT_1: 'C1',
    COMPONENT_1_LABEL: 'Component 1',
    COMPONENT_2: 'C2',
    COMPONENT_2_LABEL: 'Component 2',
    COMPONENT_3: 'C3',
    COMPONENT_3_LABEL: 'Component 3',
    EXTERNAL_1: 'E1',
    EXTERNAL_1_LABEL: 'External 1',
    EXTERNAL_2: 'E2',
    EXTERNAL_2_LABEL: 'External 2',
    FLOW_1: 'Input',
    FLOW_2: 'Process',
    FLOW_3: 'Output',
    FLOW_4: 'Feedback'
  },
  'sequence': {
    ACTOR_1: 'User',
    ACTOR_1_LABEL: 'User',
    ACTOR_2: 'System',
    ACTOR_2_LABEL: 'System',
    ACTOR_3: 'Service',
    ACTOR_3_LABEL: 'Service',
    MESSAGE_1: 'Request',
    MESSAGE_2: 'Process',
    MESSAGE_3: 'Query',
    NOTE_1: 'Processing',
    RESPONSE_1: 'Data',
    RESPONSE_2: 'Result',
    RESPONSE_3: 'Status',
    OPTIONAL_CONDITION: 'If needed'
  },
  'gantt': {
    CHART_TITLE: 'Project Timeline',
    SECTION_1_TITLE: 'Phase 1',
    TASK_1_1: 'Task 1',
    TASK_1_1_ID: 't1',
    TASK_1_1_START: '2024-01-01',
    TASK_1_1_DURATION: '2d',
    TASK_1_2: 'Task 2',
    TASK_1_2_ID: 't2',
    TASK_1_2_START: '2024-01-03',
    TASK_1_2_DURATION: '3d',
    TASK_1_3: 'Task 3',
    TASK_1_3_ID: 't3',
    TASK_1_3_START: '2024-01-06',
    TASK_1_3_DURATION: '2d',
    SECTION_2_TITLE: 'Phase 2',
    TASK_2_1: 'Task 4',
    TASK_2_1_ID: 't4',
    TASK_2_1_START: '2024-01-08',
    TASK_2_1_DURATION: '4d',
    TASK_2_2: 'Task 5',
    TASK_2_2_ID: 't5',
    TASK_2_2_START: '2024-01-12',
    TASK_2_2_DURATION: '2d',
    SECTION_3_TITLE: 'Phase 3',
    TASK_3_1: 'Task 6',
    TASK_3_1_ID: 't6',
    TASK_3_1_START: '2024-01-14',
    TASK_3_1_DURATION: '3d',
    TASK_3_2: 'Task 7',
    TASK_3_2_ID: 't7',
    TASK_3_2_START: '2024-01-17',
    TASK_3_2_DURATION: '2d'
  },
  'mindmap': {
    ROOT_CONCEPT: 'Central Concept',
    BRANCH_1: 'Branch 1',
    BRANCH_1_CHILD_1: 'Item 1',
    BRANCH_1_CHILD_2: 'Item 2',
    BRANCH_1_CHILD_3: 'Item 3',
    BRANCH_2: 'Branch 2',
    BRANCH_2_CHILD_1: 'Item 4',
    BRANCH_2_CHILD_2: 'Item 5',
    BRANCH_2_CHILD_3: 'Item 6',
    BRANCH_3: 'Branch 3',
    BRANCH_3_CHILD_1: 'Item 7',
    BRANCH_3_CHILD_2: 'Item 8',
    BRANCH_3_CHILD_3: 'Item 9',
    BRANCH_4: 'Branch 4',
    BRANCH_4_CHILD_1: 'Item 10',
    BRANCH_4_CHILD_2: 'Item 11',
    BRANCH_4_CHILD_3: 'Item 12'
  }
};

function generateEnhancedContent(chapterNum) {
  const contentPath = join(REPO_ROOT, 'diagrams', `chapter-${chapterNum}`, 'content.json');
  const existing = JSON.parse(readFileSync(contentPath, 'utf-8'));
  
  const templates = CHAPTER_TEMPLATES[chapterNum];
  if (!templates) {
    console.log(`⏭️  No new diagrams for chapter ${chapterNum}`);
    return;
  }
  
  const newDiagrams = templates.map(template => ({
    template,
    placeholders: PLACEHOLDERS[template] || { PLACEHOLDER: 'TODO' }
  }));
  
  const enhanced = {
    ...existing,
    diagrams: [...existing.diagrams, ...newDiagrams]
  };
  
  const enhancedPath = join(REPO_ROOT, 'diagrams', `chapter-${chapterNum}`, 'content-enhanced.json');
  writeFileSync(enhancedPath, JSON.stringify(enhanced, null, 2));
  console.log(`✅ Created ${enhancedPath}`);
}

function main() {
  console.log('🚀 Batch generating enhanced content.json for all chapters...\n');
  
  for (const ch of Object.keys(CHAPTER_TEMPLATES)) {
    try {
      generateEnhancedContent(ch);
    } catch (err) {
      console.error(`❌ Error processing chapter ${ch}:`, err.message);
    }
  }
  
  console.log('\n✅ All enhanced content.json files created!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review and customize placeholder content for each chapter');
  console.log('   2. Run generation for each chapter:');
  console.log('      for ch in 03 04 05 06 07 08 09 10 11 12 13 14; do');
  console.log('        node /path/to/generate.mjs --content diagrams/chapter-$ch/content-enhanced.json --out diagrams/chapter-$ch');
  console.log('      done');
  console.log('   3. Insert diagram references into markdown files');
}

main();
