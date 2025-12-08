// Regex patterns for validating README sections

const regexPatterns = {
  // Title - H1 heading at the start
  title: /^# .+/,

  // Tagline - bold text (typically after title, before badges)
  tagline: /^\*\*[^\n]+\*\*$/m,

  // Badges - markdown image syntax, typically shields.io
  badge: /!\[.+?\]\(.+?\)/g,
  badgeShieldsIo: /!\[.+?\]\(https:\/\/img\.shields\.io\/.+?\)/g,

  // Specific sections
  whatAndWhy: /^## What & Why/mi,
  quickStart: (/^## Quick Start/mi|/^## Getting Started/mi|/^## Installation/mi),
  visualPreview: /^## Visual Preview/mi,
  documentation: (/^## Documentation/mi|/^## Docs/mi),
  contributors: (/^## Contributors/mi|/^## Contributing/mi|/^## How to Contribute/mi|/^## Contribute/mi),
  license: /^## (License|Licensing)/mi,
  tableOfContents: (/^## Table of Contents/mi|/^## Contents/mi|/^## Index/mi|/^## TOC/mi),

  // Problem/Solution format within What & Why
  problemStatement: /\*\*The Problem:\*\*/mi,
  solutionStatement: /\*\*(?:Our )?Solution:\*\*/mi,

  // Code blocks (fenced with triple backticks)
  codeBlock: /```[\s\S]*?```/g,
  codeBlockWithLang: /```(?:\w+)\n[\s\S]*?```/g,

  // Markdown images (for Visual Preview)
  image: /!\[.+?\]\(.+?\)/g,

  // Links
  wikiLink: /\[.+?\]\(https:\/\/github\.com\/.+?\/wiki.+?\)/g,

  // License reference
  licenseLink: /\[MIT License\]\(LICENSE\)|\[Apache.*?\]\(LICENSE\)|\[GPL.*?\]\(LICENSE\)/i,

  // HTML comments (template instructions to be removed)
  htmlComment: /<!--[\s\S]*?-->/g,

  // DELETE instruction blocks
  deleteInstruction: /^>\s*\*\*DELETE:\*\*.+$/gm,
};

export default regexPatterns;