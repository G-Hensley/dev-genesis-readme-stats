import { describe, it } from 'node:test';
import assert from 'node:assert';
import regexPatterns from './regex.js';

// Helper to test if pattern matches content
const matches = (pattern, content) => {
  // Reset lastIndex for global patterns
  if (pattern.global) pattern.lastIndex = 0;
  return pattern.test(content);
};

// Helper to count matches for global patterns
const countMatches = (pattern, content) => {
  if (pattern.global) pattern.lastIndex = 0;
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
};

// =============================================================================
// Title Detection Tests
// =============================================================================
describe('Title Detection', () => {
  it('should match H1 with # syntax', () => {
    assert.ok(matches(regexPatterns.title, '# My Project'));
  });

  it('should match H1 at start of file', () => {
    assert.ok(matches(regexPatterns.title, '# readme-stats\n\nSome content'));
  });

  it('should not match H2 headings', () => {
    assert.ok(!matches(regexPatterns.title, '## Not a title'));
  });

  it('should not match # in middle of line', () => {
    assert.ok(!matches(regexPatterns.title, 'Some text # not a heading'));
  });

  it('should require content after #', () => {
    assert.ok(!matches(regexPatterns.title, '#'));
    assert.ok(!matches(regexPatterns.title, '# '));
  });
});

// =============================================================================
// Tagline Detection Tests
// =============================================================================
describe('Tagline Detection', () => {
  it('should match bold text on its own line', () => {
    assert.ok(matches(regexPatterns.tagline, '**A simple CLI tool for analyzing READMEs**'));
  });

  it('should match tagline in multiline content', () => {
    const content = `# Title

**This is a tagline**

Some other content`;
    assert.ok(matches(regexPatterns.tagline, content));
  });

  it('should not match inline bold text', () => {
    assert.ok(!matches(regexPatterns.tagline, 'This has **bold** in the middle'));
  });

  it('should not match unclosed bold', () => {
    assert.ok(!matches(regexPatterns.tagline, '**Not closed'));
  });
});

// =============================================================================
// Badge Detection Tests
// =============================================================================
describe('Badge Detection', () => {
  it('should match standard markdown image badge', () => {
    assert.ok(matches(regexPatterns.badge, '![Build Status](https://example.com/badge.svg)'));
  });

  it('should count multiple badges', () => {
    const content = '![Badge1](url1) ![Badge2](url2) ![Badge3](url3)';
    assert.strictEqual(countMatches(regexPatterns.badge, content), 3);
  });

  it('should match shields.io badges specifically', () => {
    assert.ok(matches(regexPatterns.badgeShieldsIo, '![npm](https://img.shields.io/npm/v/package)'));
  });

  it('should not match non-shields.io as shields.io badge', () => {
    assert.ok(!matches(regexPatterns.badgeShieldsIo, '![Build](https://travis-ci.org/badge.svg)'));
  });

  it('should count multiple shields.io badges', () => {
    const content = `![npm](https://img.shields.io/npm/v/pkg)
![license](https://img.shields.io/badge/license-MIT-blue)
![build](https://github.com/user/repo/actions/badge.svg)`;
    assert.strictEqual(countMatches(regexPatterns.badgeShieldsIo, content), 2);
  });
});

// =============================================================================
// What & Why Section Tests
// =============================================================================
describe('What & Why Section', () => {
  it('should match "## What & Why"', () => {
    assert.ok(matches(regexPatterns.whatAndWhy, '## What & Why'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.whatAndWhy, '## WHAT & WHY'));
    assert.ok(matches(regexPatterns.whatAndWhy, '## what & why'));
  });

  it('should match at start of line in multiline content', () => {
    const content = `# Title

## What & Why

Some explanation`;
    assert.ok(matches(regexPatterns.whatAndWhy, content));
  });

  it('should not match if not at start of line', () => {
    assert.ok(!matches(regexPatterns.whatAndWhy, 'See ## What & Why section'));
  });
});

// =============================================================================
// Quick Start / Installation Section Tests
// =============================================================================
describe('Quick Start Section', () => {
  it('should match "## Quick Start"', () => {
    assert.ok(matches(regexPatterns.quickStart, '## Quick Start'));
  });

  it('should match "## Getting Started"', () => {
    assert.ok(matches(regexPatterns.quickStart, '## Getting Started'));
  });

  it('should match "## Installation"', () => {
    assert.ok(matches(regexPatterns.quickStart, '## Installation'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.quickStart, '## QUICK START'));
    assert.ok(matches(regexPatterns.quickStart, '## installation'));
    assert.ok(matches(regexPatterns.quickStart, '## GETTING STARTED'));
  });

  it('should not match partial variations', () => {
    // These shouldn't match because they're not the exact variations
    assert.ok(!matches(regexPatterns.quickStart, '## Install'));
    assert.ok(!matches(regexPatterns.quickStart, '## Quick'));
    assert.ok(!matches(regexPatterns.quickStart, '## Start'));
  });

  it('should match in multiline content', () => {
    const content = `# My Project

## Installation

\`\`\`bash
npm install my-project
\`\`\``;
    assert.ok(matches(regexPatterns.quickStart, content));
  });
});

// =============================================================================
// Visual Preview Section Tests
// =============================================================================
describe('Visual Preview Section', () => {
  it('should match "## Visual Preview"', () => {
    assert.ok(matches(regexPatterns.visualPreview, '## Visual Preview'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.visualPreview, '## VISUAL PREVIEW'));
    assert.ok(matches(regexPatterns.visualPreview, '## visual preview'));
  });

  it('should not match variations', () => {
    assert.ok(!matches(regexPatterns.visualPreview, '## Preview'));
    assert.ok(!matches(regexPatterns.visualPreview, '## Screenshots'));
  });
});

// =============================================================================
// Documentation Section Tests
// =============================================================================
describe('Documentation Section', () => {
  it('should match "## Documentation"', () => {
    assert.ok(matches(regexPatterns.documentation, '## Documentation'));
  });

  it('should match "## Docs"', () => {
    assert.ok(matches(regexPatterns.documentation, '## Docs'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.documentation, '## DOCUMENTATION'));
    assert.ok(matches(regexPatterns.documentation, '## docs'));
  });
});

// =============================================================================
// Contributors Section Tests
// =============================================================================
describe('Contributors Section', () => {
  it('should match "## Contributors"', () => {
    assert.ok(matches(regexPatterns.contributors, '## Contributors'));
  });

  it('should match "## Contributing"', () => {
    assert.ok(matches(regexPatterns.contributors, '## Contributing'));
  });

  it('should match "## How to Contribute"', () => {
    assert.ok(matches(regexPatterns.contributors, '## How to Contribute'));
  });

  it('should match "## Contribute"', () => {
    assert.ok(matches(regexPatterns.contributors, '## Contribute'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.contributors, '## CONTRIBUTORS'));
    assert.ok(matches(regexPatterns.contributors, '## contributing'));
  });
});

// =============================================================================
// License Section Tests
// =============================================================================
describe('License Section', () => {
  it('should match "## License"', () => {
    assert.ok(matches(regexPatterns.license, '## License'));
  });

  it('should match "## Licensing"', () => {
    assert.ok(matches(regexPatterns.license, '## Licensing'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.license, '## LICENSE'));
    assert.ok(matches(regexPatterns.license, '## license'));
  });
});

// =============================================================================
// Table of Contents Tests
// =============================================================================
describe('Table of Contents Section', () => {
  it('should match "## Table of Contents"', () => {
    assert.ok(matches(regexPatterns.tableOfContents, '## Table of Contents'));
  });

  it('should match "## Contents"', () => {
    assert.ok(matches(regexPatterns.tableOfContents, '## Contents'));
  });

  it('should match "## Index"', () => {
    assert.ok(matches(regexPatterns.tableOfContents, '## Index'));
  });

  it('should match "## TOC"', () => {
    assert.ok(matches(regexPatterns.tableOfContents, '## TOC'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.tableOfContents, '## TABLE OF CONTENTS'));
    assert.ok(matches(regexPatterns.tableOfContents, '## toc'));
  });
});

// =============================================================================
// Problem/Solution Statement Tests
// =============================================================================
describe('Problem Statement', () => {
  it('should match "**The Problem:**"', () => {
    assert.ok(matches(regexPatterns.problemStatement, '**The Problem:**'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.problemStatement, '**THE PROBLEM:**'));
    assert.ok(matches(regexPatterns.problemStatement, '**the problem:**'));
  });

  it('should match in context', () => {
    const content = `## What & Why

**The Problem:** READMEs are often incomplete.

**Our Solution:** This tool helps.`;
    assert.ok(matches(regexPatterns.problemStatement, content));
  });
});

describe('Solution Statement', () => {
  it('should match "**Solution:**"', () => {
    assert.ok(matches(regexPatterns.solutionStatement, '**Solution:**'));
  });

  it('should match "**Our Solution:**"', () => {
    assert.ok(matches(regexPatterns.solutionStatement, '**Our Solution:**'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.solutionStatement, '**SOLUTION:**'));
    assert.ok(matches(regexPatterns.solutionStatement, '**OUR SOLUTION:**'));
  });
});

// =============================================================================
// Code Block Tests
// =============================================================================
describe('Code Block Detection', () => {
  it('should match simple code block', () => {
    assert.ok(matches(regexPatterns.codeBlock, '```\ncode here\n```'));
  });

  it('should match code block with language', () => {
    assert.ok(matches(regexPatterns.codeBlockWithLang, '```javascript\nconst x = 1;\n```'));
  });

  it('should count multiple code blocks', () => {
    const content = `\`\`\`bash
npm install
\`\`\`

Some text

\`\`\`javascript
console.log('hello');
\`\`\``;
    assert.strictEqual(countMatches(regexPatterns.codeBlock, content), 2);
  });

  it('should match various languages', () => {
    assert.ok(matches(regexPatterns.codeBlockWithLang, '```python\nprint("hi")\n```'));
    assert.ok(matches(regexPatterns.codeBlockWithLang, '```bash\necho hi\n```'));
    assert.ok(matches(regexPatterns.codeBlockWithLang, '```json\n{"key": "value"}\n```'));
  });

  it('should not match inline code', () => {
    assert.ok(!matches(regexPatterns.codeBlock, 'Use `npm install` to install'));
  });
});

// =============================================================================
// Image Detection Tests
// =============================================================================
describe('Image Detection', () => {
  it('should match markdown image syntax', () => {
    assert.ok(matches(regexPatterns.image, '![Screenshot](./images/screenshot.png)'));
  });

  it('should match remote images', () => {
    assert.ok(matches(regexPatterns.image, '![Logo](https://example.com/logo.png)'));
  });

  it('should count multiple images', () => {
    const content = `![img1](url1)
![img2](url2)
![img3](url3)`;
    assert.strictEqual(countMatches(regexPatterns.image, content), 3);
  });
});

// =============================================================================
// Wiki Link Tests
// =============================================================================
describe('Wiki Link Detection', () => {
  it('should match GitHub wiki links with subpages', () => {
    assert.ok(matches(regexPatterns.wikiLink, '[Wiki](https://github.com/user/repo/wiki/Home)'));
  });

  it('should match wiki subpages', () => {
    assert.ok(matches(regexPatterns.wikiLink, '[Setup Guide](https://github.com/user/repo/wiki/Setup)'));
  });

  it('should not match base wiki URL without subpage (known limitation)', () => {
    // The current regex requires at least one character after /wiki
    assert.ok(!matches(regexPatterns.wikiLink, '[Wiki](https://github.com/user/repo/wiki)'));
  });

  it('should not match non-wiki GitHub links', () => {
    assert.ok(!matches(regexPatterns.wikiLink, '[Repo](https://github.com/user/repo)'));
    assert.ok(!matches(regexPatterns.wikiLink, '[Issues](https://github.com/user/repo/issues)'));
  });
});

// =============================================================================
// License Link Tests
// =============================================================================
describe('License Link Detection', () => {
  it('should match MIT License link', () => {
    assert.ok(matches(regexPatterns.licenseLink, '[MIT License](LICENSE)'));
  });

  it('should match Apache license link', () => {
    assert.ok(matches(regexPatterns.licenseLink, '[Apache 2.0](LICENSE)'));
    assert.ok(matches(regexPatterns.licenseLink, '[Apache License](LICENSE)'));
  });

  it('should match GPL license link', () => {
    assert.ok(matches(regexPatterns.licenseLink, '[GPL v3](LICENSE)'));
    assert.ok(matches(regexPatterns.licenseLink, '[GPL](LICENSE)'));
  });

  it('should be case insensitive', () => {
    assert.ok(matches(regexPatterns.licenseLink, '[mit license](LICENSE)'));
  });
});

// =============================================================================
// HTML Comment Tests
// =============================================================================
describe('HTML Comment Detection', () => {
  it('should match single-line comments', () => {
    assert.ok(matches(regexPatterns.htmlComment, '<!-- This is a comment -->'));
  });

  it('should match multi-line comments', () => {
    const content = `<!--
This is a
multi-line comment
-->`;
    assert.ok(matches(regexPatterns.htmlComment, content));
  });

  it('should count multiple comments', () => {
    const content = `<!-- Comment 1 -->
Some content
<!-- Comment 2 -->
More content
<!-- Comment 3 -->`;
    assert.strictEqual(countMatches(regexPatterns.htmlComment, content), 3);
  });
});

// =============================================================================
// DELETE Instruction Tests
// =============================================================================
describe('DELETE Instruction Detection', () => {
  it('should match DELETE instruction blockquote', () => {
    assert.ok(matches(regexPatterns.deleteInstruction, '> **DELETE:** Remove this section before publishing'));
  });

  it('should match with different spacing', () => {
    assert.ok(matches(regexPatterns.deleteInstruction, '>  **DELETE:** Extra space'));
  });

  it('should count multiple DELETE instructions', () => {
    const content = `> **DELETE:** First instruction

Some content

> **DELETE:** Second instruction`;
    assert.strictEqual(countMatches(regexPatterns.deleteInstruction, content), 2);
  });

  it('should not match DELETE in regular text', () => {
    assert.ok(!matches(regexPatterns.deleteInstruction, 'Please DELETE this file'));
  });
});

// =============================================================================
// Edge Cases
// =============================================================================
describe('Edge Cases', () => {
  it('should handle empty string', () => {
    assert.ok(!matches(regexPatterns.title, ''));
    assert.ok(!matches(regexPatterns.whatAndWhy, ''));
    assert.ok(!matches(regexPatterns.badge, ''));
  });

  it('should handle string with only whitespace', () => {
    assert.ok(!matches(regexPatterns.title, '   \n\t\n   '));
    assert.ok(!matches(regexPatterns.quickStart, '   \n\t\n   '));
  });

  it('should handle file with no headings', () => {
    const content = `Just some text without any headings.

More paragraphs here.

And some **bold** text.`;
    assert.ok(!matches(regexPatterns.title, content));
    assert.ok(!matches(regexPatterns.whatAndWhy, content));
    assert.ok(!matches(regexPatterns.quickStart, content));
  });

  it('should handle file with only code blocks', () => {
    const content = `\`\`\`javascript
const x = 1;
\`\`\``;
    assert.ok(!matches(regexPatterns.title, content));
    assert.ok(matches(regexPatterns.codeBlock, content));
  });

  it('should not match headings inside code blocks when code block starts first', () => {
    // The title regex requires ^ anchor at start, so code block prefix prevents match
    const content = `\`\`\`markdown
# This is inside a code block
## Installation
\`\`\``;
    // Title won't match because ^ anchors to start of string, not line
    assert.ok(!matches(regexPatterns.title, content));
    // But quickStart uses /m flag so it matches lines inside code blocks (known limitation)
    assert.ok(matches(regexPatterns.quickStart, content));
  });

  it('should handle very long content', () => {
    const longContent = '# Title\n' + 'a'.repeat(100000) + '\n## Installation';
    assert.ok(matches(regexPatterns.title, longContent));
    assert.ok(matches(regexPatterns.quickStart, longContent));
  });

  it('should handle special characters in headings', () => {
    assert.ok(matches(regexPatterns.title, '# Project-Name_v2.0'));
    assert.ok(matches(regexPatterns.title, "# What's New?"));
    assert.ok(matches(regexPatterns.title, '# 🚀 Rocket Project'));
  });
});

// =============================================================================
// H1/H2 Syntax Variations
// =============================================================================
describe('Heading Syntax Variations', () => {
  it('should match H1 with # syntax', () => {
    assert.ok(matches(regexPatterns.title, '# My Project'));
  });

  it('should require ## for section headings', () => {
    // Section patterns require ## prefix
    assert.ok(!matches(regexPatterns.whatAndWhy, '# What & Why'));
    assert.ok(matches(regexPatterns.whatAndWhy, '## What & Why'));
  });

  it('should not match ### or deeper headings for sections', () => {
    assert.ok(!matches(regexPatterns.quickStart, '### Installation'));
    assert.ok(!matches(regexPatterns.license, '#### License'));
  });

  // Note: Current implementation does not support underline-style headings
  // These tests document this limitation
  it('should NOT match underline-style H1 (=== syntax) - known limitation', () => {
    const content = `My Project
==========`;
    assert.ok(!matches(regexPatterns.title, content));
  });

  it('should NOT match underline-style H2 (--- syntax) - known limitation', () => {
    const content = `Installation
------------`;
    assert.ok(!matches(regexPatterns.quickStart, content));
  });
});

// =============================================================================
// Real-World README Fixture Tests
// =============================================================================
describe('Real-World README Patterns', () => {
  it('should detect sections in a typical README', () => {
    const readme = `# awesome-project

**A fantastic tool for developers**

![npm](https://img.shields.io/npm/v/awesome-project)
![license](https://img.shields.io/badge/license-MIT-blue)

## What & Why

**The Problem:** Existing tools are too complex.

**Our Solution:** We made it simple.

## Quick Start

\`\`\`bash
npm install awesome-project
\`\`\`

## Documentation

See our [Wiki](https://github.com/user/awesome-project/wiki/Home) for full docs.

## Contributing

We welcome contributions!

## License

[MIT License](LICENSE)`;

    assert.ok(matches(regexPatterns.title, readme));
    assert.ok(matches(regexPatterns.tagline, readme));
    assert.strictEqual(countMatches(regexPatterns.badgeShieldsIo, readme), 2);
    assert.ok(matches(regexPatterns.whatAndWhy, readme));
    assert.ok(matches(regexPatterns.problemStatement, readme));
    assert.ok(matches(regexPatterns.solutionStatement, readme));
    assert.ok(matches(regexPatterns.quickStart, readme));
    assert.ok(matches(regexPatterns.codeBlock, readme));
    assert.ok(matches(regexPatterns.documentation, readme));
    assert.ok(matches(regexPatterns.wikiLink, readme));
    assert.ok(matches(regexPatterns.contributors, readme));
    assert.ok(matches(regexPatterns.license, readme));
    assert.ok(matches(regexPatterns.licenseLink, readme));
  });

  it('should detect template artifacts', () => {
    const templateReadme = `# My Project

<!-- DELETE: Replace this with your project name -->

> **DELETE:** Remove all template instructions before publishing

## Installation

Some content here.`;

    assert.ok(matches(regexPatterns.htmlComment, templateReadme));
    assert.ok(matches(regexPatterns.deleteInstruction, templateReadme));
  });
});
