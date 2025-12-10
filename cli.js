#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';
import regexPatterns from './regex.js';
import { calculateScore } from './scores.js';
import suggestions from './suggestions.js';
import chalk from 'chalk';
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
    console.log(chalk.green(`\nAnalyzing README file: ${filePath}`));

    const readmeContent = readFile(filePath);
    const analysisResults = {};

    // Check for each section using regex patterns
    for (const [section, pattern] of Object.entries(regexPatterns)) {
      analysisResults[section] = readmeContent.match(pattern) !== null;
    }

    // Calculate score
    const { totalScore, missingSections, sectionsToRemove } = calculateScore(analysisResults);

    console.log(chalk.yellow('--------------------------------\n'));
    // Output results
    if (totalScore >= 80) {
      console.log(chalk.green(`Total Score: ${totalScore}/100`));
    } else if (totalScore >= 50) {
      console.log(chalk.yellow(`Total Score: ${totalScore}/100`));
    } else {
      console.log(chalk.red(`Total Score: ${totalScore}/100`));
    }

    if (missingSections.length > 0) {
      console.log(chalk.red('Missing Sections:'));
      missingSections.forEach(section => {
        console.log(`❌ ${section}`);
        if (suggestions[section]) {
          console.log(chalk.dim(`   → ${suggestions[section]}`));
        }
      });
    } else {
      console.log(chalk.green('All sections are present!'));
    }
    console.log(chalk.yellow('--------------------------------'));
    if (sectionsToRemove.length > 0) {
      console.log(chalk.red('Sections that should be removed:'));
      sectionsToRemove.forEach(section => console.log(`❌ ${section}`));
    } else {
      console.log(chalk.green('No sections need to be removed!'));
    }
  });

// Parse the command-line arguments
program.parse();