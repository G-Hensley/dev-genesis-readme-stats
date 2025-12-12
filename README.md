# readme-stats

**A zero-config CLI tool that analyzes README files for completeness and quality.**

[![npm version](https://img.shields.io/npm/v/readme-stats)](https://www.npmjs.com/package/readme-stats)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)

## Table of Contents

- [What & Why](#what--why)
- [Visual Preview](#visual-preview)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## What & Why

**The Problem:** README files are the first impression of your project, yet many are incomplete or missing critical sections. Developers often forget important elements like installation instructions, usage examples, or license information before publishing.

**Our Solution:** readme-stats analyzes your README against best practices and provides:
- A completeness score (0-100)
- Identification of missing sections
- Actionable suggestions for improvement

Stop guessing if your documentation is complete. Know before you ship.

## Visual Preview

![readme-stats output](https://img.shields.io/badge/Score-100%2F100-brightgreen)

```
$ readme-stats analyze README.md

Analyzing README file: README.md
--------------------------------

Total Score: 100/100
All sections are present!
--------------------------------
No sections need to be removed!
```

## Quick Start

### Installation

```bash
# Using npm
npm install -g readme-stats

# Using pnpm
pnpm add -g readme-stats

# Or run directly with npx
npx readme-stats analyze README.md
```

### Usage

```bash
# Analyze a README file
readme-stats analyze README.md

# Analyze any README by path
readme-stats analyze ../my-project/README.md
```

### Example Output

When sections are missing:

```
$ readme-stats analyze README.md

Analyzing README file: README.md
--------------------------------

Total Score: 45/100
Missing Sections:
❌ quickStart
   → Add a ## Quick Start section with installation commands
❌ license
   → Add a ## License section - common choices: MIT, Apache 2.0, GPL
❌ contributors
   → Add a ## Contributing section explaining how others can contribute
--------------------------------
No sections need to be removed!
```

## Documentation

### Scoring Criteria

| Section | Points | Detection Pattern |
|---------|--------|-------------------|
| Title | 15 | `# Heading` at start |
| What & Why | 15 | `## What & Why` heading |
| Quick Start | 10 | `## Quick Start`, `## Getting Started`, or `## Installation` |
| Tagline | 5 | Bold text `**tagline**` |
| Visual Preview | 5 | `## Visual Preview` heading |
| Documentation | 5 | `## Documentation` or `## Docs` |
| Contributors | 5 | `## Contributing`, `## Contributors`, etc. |
| License | 5 | `## License` heading |
| Table of Contents | 5 | `## Table of Contents`, `## Contents`, etc. |
| Problem Statement | 5 | `**The Problem:**` text |
| Solution Statement | 5 | `**Our Solution:**` or `**Solution:**` text |
| Code Block | 5 | Triple backtick code blocks |
| Image | 5 | Markdown image syntax `![alt](url)` |
| Wiki Link | 5 | Link to GitHub wiki |
| License Link | 3 | Link to LICENSE file |
| Badges | 2 | shields.io badge images |

**Penalties:**
| Issue | Points |
|-------|--------|
| HTML comments present | -10 |
| DELETE instructions | -10 |

### Section Variations

The tool recognizes common variations of section names:

| Category | Accepted Variations |
|----------|---------------------|
| Quick Start | `Quick Start`, `Getting Started`, `Installation` |
| Documentation | `Documentation`, `Docs` |
| Contributors | `Contributors`, `Contributing`, `How to Contribute`, `Contribute` |
| License | `License`, `Licensing` |
| Table of Contents | `Table of Contents`, `Contents`, `Index`, `TOC` |

### Score Thresholds

- **80-100** (Green): Excellent README - ready to publish
- **50-79** (Yellow): Needs improvement - missing some sections
- **0-49** (Red): Incomplete - missing critical documentation

For detailed documentation, visit the [project wiki](https://github.com/G-Hensley/dev-genesis-readme-stats/wiki/).

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/G-Hensley/dev-genesis-readme-stats.git
cd dev-genesis-readme-stats

# Install dependencies
pnpm install

# Run locally
node cli.js analyze README.md

# Run tests
pnpm test
```

### Adding New Section Detection

1. Add the regex pattern to `regex.js`
2. Add the point value to `scores.js`
3. Add a suggestion to `suggestions.js`
4. Test with `node cli.js analyze README.md`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [MIT License](LICENSE) file for details.

---

Made with [dev-genesis](https://github.com/G-Hensley/dev-genesis)
