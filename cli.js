#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';
import regexPatterns from './regex.js';
import score from './scores.js';
const { default: pkg } = await import('./package.json', { with: { type: "json" } });
const version = pkg.version;

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${filePath}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
};

const program = new Command();

// Define the CLI structure and commands
program
  .name('readme-stats')
  .description('CLI tool to analyze README files')
  .version(version);

program.command('analyze')
  .description('Analyze the README file for completeness')
  .argument('<file>', 'path to the README file')
  .action((filePath) => {
    console.log(`Analyzing README file: ${filePath}`);
    // TODO: Implement analysis logic here
    const readmeContent = readFile(filePath);
    const analysisResults = {};

    // Check for each section using regex patterns
    for (const [section, pattern] of Object.entries(regexPatterns)) {
      analysisResults[section] = pattern.test(readmeContent);
    }

    // Calculate score
    const { totalScore, missingSections, needToRemove } = score(analysisResults);

    console.log('--------------------------------\n');
    // Output results
    console.log(`Total Score: ${totalScore}/100\n`);
    if (missingSections.length > 0) {
      console.log('Missing Sections:');
      missingSections.forEach(section => console.log(`- ${section}`));
    } else {
      console.log('All sections are present!');
    }
    console.log('--------------------------------');
    if (needToRemove.length > 0) {
      console.log('Sections that should be removed:');
      needToRemove.forEach(section => console.log(`- ${section}`));
    }
  });

// Parse the command-line arguments
program.parse();