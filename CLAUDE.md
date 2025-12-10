# Project Intelligence

## About This Project

This project was initialized with [dev-genesis](https://github.com/G-Hensley/dev-genesis).

**Project Name:** readme-stats

**Purpose:** A zero-config CLI tool that analyzes README files for completeness and quality. It scores READMEs against best practices (0-100 scale), identifies missing critical sections, and provides actionable suggestions for improvement. Built for developers who want to ensure their documentation is complete before publishing projects.

**Current Status:** In Development

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | JavaScript (Node.js, ES Modules) |
| CLI Framework | Commander.js v14.x |
| Terminal Styling | Chalk v5 |
| Package Manager | pnpm |
| CI/CD | GitHub Actions |

## Architecture

### Pattern
Modular CLI architecture with separation of concerns - each module handles a specific aspect of the analysis pipeline.

### Key Design Decisions
- **Single-file modules**: Each concern (regex patterns, scoring, suggestions) is in its own file for maintainability
- **Zero dependencies beyond CLI essentials**: Only Commander (CLI parsing) and Chalk (colors) - no bloat
- **Regex-based detection**: Flexible pattern matching allows easy addition of new section types
- **Point-based scoring**: Weighted scoring system where different sections have different importance levels

### Directory Structure

```
/
├── cli.js            # Main entry point - CLI logic and orchestration
├── regex.js          # Section detection patterns
├── scores.js         # Scoring logic and point values
├── suggestions.js    # Actionable suggestions for missing sections
├── .claude/          # Claude Code configuration and commands
├── .github/          # GitHub workflows, templates, and settings
├── docs/             # Documentation (getting started, workflows)
├── prompts/          # AI planning prompts
└── scripts/          # Setup scripts (unix/windows)
```

## Key Files

| File | Purpose |
|------|---------|
| `cli.js` | Main CLI entry point - handles argument parsing, file reading, analysis orchestration, and colored console output |
| `regex.js` | Contains regex patterns for detecting README sections (title, badges, documentation, license, etc.) |
| `scores.js` | Scoring system that calculates total score and identifies missing sections based on point values |
| `suggestions.js` | Actionable, context-specific suggestions for each missing README element |
| `project-spec.md` | Complete project specification with requirements, success criteria, and scope |

## Development Guidelines

### Code Style
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add comments only for complex logic or "why" explanations

### Git Workflow
- Use [Conventional Commits](https://www.conventionalcommits.org/)
- Branch naming: `feature/`, `fix/`, `docs/`, `refactor/`
- All PRs require review before merging

### Security
- Validate file paths to prevent directory traversal
- Handle file read errors gracefully
- Never execute user-provided content

## Common Tasks

### Development

```bash
# Install dependencies
pnpm install

# Run the CLI analyzer
./cli.js analyze <path-to-readme>

# Example usage
./cli.js analyze README.md
./cli.js analyze ../my-project/README.md
```

### Testing Locally

```bash
# Test against the template README
./cli.js analyze README.TEMPLATE.md

# Test against any README file
./cli.js analyze /path/to/your/README.md
```

## Claude Code Commands

This project includes custom Claude Code commands in `.claude/commands/`:

| Command | Description |
|---------|-------------|
| `/code-review` | Comprehensive code review |
| `/security-audit` | Security vulnerability analysis |
| `/performance-review` | Performance optimization suggestions |
| `/generate-tests` | Generate test cases |
| `/pre-commit-check` | Pre-commit verification |
| `/accessibility-review` | WCAG compliance check |
| `/refactor-suggestions` | Code improvement recommendations |
| `/test-coverage-check` | Test coverage analysis |
| `/documentation-review` | Documentation completeness check |

## Scoring System

The analyzer uses a point-based scoring system:

| Section | Points |
|---------|--------|
| Title | 15 |
| What & Why (Description) | 15 |
| Quick Start (or Getting Started/Installation) | 10 |
| Tagline | 5 |
| Visual Preview | 5 |
| Documentation (or Docs) | 5 |
| Contributors (or Contributing) | 5 |
| License | 5 |
| Table of Contents | 5 |
| Problem Statement | 5 |
| Solution Statement | 5 |
| Code Block | 5 |
| Image | 5 |
| Wiki Link | 5 |
| License Link | 3 |
| Badges (shields.io) | 2 each |
| **Penalties** | |
| HTML comments present | -10 |
| DELETE instructions present | -10 |

> **Note:** For the canonical list of scored sections, see [scores.js](scores.js).

**Score thresholds:**
- Green (80+): Excellent README
- Yellow (50-79): Needs improvement
- Red (<50): Missing critical sections

## Adding New Section Detection

To add a new section pattern:

1. Add the regex pattern to `regex.js`
2. Add the point value to `scores.js`
3. Add an actionable suggestion to `suggestions.js`
4. Test with `./cli.js analyze README.TEMPLATE.md`

## Known Areas for Improvement

- No formal test suite yet (testing is manual)
- Could add JSON output format for CI integration
- Could add a `--fix` flag to auto-generate missing sections

## Resources

- [Documentation](docs/)
- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Project Specification](project-spec.md)
