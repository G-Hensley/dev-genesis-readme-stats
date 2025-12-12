#!/usr/bin/env node

import fs from 'fs';
import { Command } from 'commander';
import regexPatterns from './regex.js';
import { calculateScore } from './scores.js';
import suggestions from './suggestions.js';
import chalk from 'chalk';
const { default: pkg } = await import('./package.json', { with: { type: "json" } });
const version = pkg.version;

// Check if colors should be disabled
const shouldDisableColors = () => {
  // Check for NO_COLOR environment variable (https://no-color.org/)
  if (process.env.NO_COLOR !== undefined) {
    return true;
  }
  // Check for non-TTY output (piped or redirected)
  if (!process.stdout.isTTY) {
    return true;
  }
  return false;
};

// Disable chalk colors if needed (before parsing args for --no-color)
if (shouldDisableColors()) {
  chalk.level = 0;
}

// Check if content appears to be binary or contains invalid UTF-8
const isBinaryContent = (content) => {
  // Check for null bytes or UTF-8 replacement character in a single pass
  return /[\x00\uFFFD]/.test(content);
};

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');

    // Check for binary content
    if (isBinaryContent(data)) {
      console.log(chalk.red(`\n❌ Invalid file: ${filePath}\n`));
      console.log(chalk.yellow('The file appears to be binary or contains invalid UTF-8 content.\n'));
      console.log('README files should be plain text files (typically .md or .txt).');
      console.log(chalk.dim('\nMake sure you\'re pointing to a valid markdown or text file.\n'));
      process.exit(1);
    }

    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.red(`\n❌ File not found: ${filePath}\n`));
      console.log(chalk.yellow('It looks like you don\'t have a README yet. Create one to get started!\n'));
      console.log('A good README should include:');
      console.log(chalk.cyan('  • Title') + ' - A clear project name (# heading)');
      console.log(chalk.cyan('  • Description') + ' - What your project does and why');
      console.log(chalk.cyan('  • Installation') + ' - How to install/set up the project');
      console.log(chalk.cyan('  • Usage') + ' - Examples of how to use it');
      console.log(chalk.cyan('  • License') + ' - The license for your project');
      console.log(chalk.cyan('  • Contributing') + ' - How others can contribute\n');
      console.log(chalk.dim('Tip: Create a README.md file and run this command again.\n'));
    } else {
      console.log(chalk.red(`\n❌ Error reading file: ${error.message}\n`));
    }
    process.exit(1);
  }
};

const program = new Command();

// Define the CLI structure and commands
program
  .name('readme-stats')
  .description('CLI tool to analyze README files')
  .version(version)
  .option('--no-color', 'Disable colored output')
  .hook('preAction', () => {
    // Handle --no-color flag
    if (program.opts().color === false) {
      chalk.level = 0;
    }
  });

program.command('analyze')
  .description('Analyze the README file for completeness')
  .argument('<file>', 'path to the README file')
  .action((filePath) => {
    const readmeContent = readFile(filePath);

    console.log(chalk.green(`\nAnalyzing README file: ${filePath}`));
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