Project Specification: readme-stats
Problem Statement
Developers often ship READMEs that are incomplete or missing key sections, hurting project adoption and credibility. There's no quick way to check if a README meets best practices before publishing.
Target Users

Primary: Gavin (for personal projects and Dev Genesis template users)
Secondary: Any developer who wants a quick README quality check before launch

Core Value Proposition
A zero-config CLI that scores your README against best practices and tells you exactly what's missing.
MVP Features

README Analysis

Parse README.md from current directory (or specified path)
Regex-based detection of sections by heading patterns
Handle common variations ("Install" vs "Installation", "How to Use" vs "Usage")


Scoring System

High value (20 pts each): Title, Description, Installation, Usage
Medium value (10 pts each): License, Contributing
Low value (5 pts each): Badges, Table of Contents
TOC only checked if README > 200 lines


CLI Output

Overall score out of 100
List of missing sections
Suggestions for each missing section
Colored output (green/yellow/red based on score thresholds)



Technical Requirements

Platform: Node.js CLI
Tech Stack: Single JavaScript file, minimal dependencies (chalk for colors, or zero-dep with ANSI codes)
Integrations: None
Data Requirements: None (reads local file only)
Scale: Local tool, single file at a time

Success Criteria

Works on any README.md in under 1 second
Accurately detects sections with common heading variations
Clear, actionable output that tells you what to add

Out of Scope (MVP)

CI/pipeline integration
JSON/markdown report export
Config file for custom rules
Checking README quality (grammar, length, clarity)
Checking for broken links

Assumptions

Users have Node.js installed
README follows markdown conventions (# headings)
English language READMEs

Open Questions

What heading variations should be supported? (e.g., "Setup" = "Installation"?)
Score thresholds for color coding (e.g., green > 80, yellow > 50, red ≤ 50?)

Risks & Mitigations
RiskLikelihoodImpactMitigationRegex misses valid sectionsMediumLowStart with common patterns, iterate based on real READMEsUsers want customizationLowLowOut of scope for MVP; can add config later if needed