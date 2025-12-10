// Actionable suggestions for missing README sections

const suggestions = {
  // Core sections from ticket acceptance criteria
  title: "Add a clear # H1 title at the top - this is the first thing users see",
  tagline: "Add a bold **tagline** below the title describing your project in one line",
  quickStart: "Add a ## Quick Start section with installation commands (npm install, pip install, etc.)",
  documentation: "Add a ## Documentation section linking to docs, wiki, or API reference",
  license: "Add a ## License section - common choices: MIT, Apache 2.0, GPL",
  contributors: "Add a ## Contributing section explaining how others can contribute",
  badge: "Add badges for build status, version, license, etc. (shields.io)",
  tableOfContents: "Add a ## Table of Contents for READMEs longer than 3 sections",

  // Additional tracked sections
  whatAndWhy: "Add a ## What & Why section explaining the problem your project solves",
  visualPreview: "Add a ## Visual Preview section with screenshots or GIFs",
  problemStatement: "Add **The Problem:** to clearly state the issue you're solving",
  solutionStatement: "Add **Our Solution:** to explain how your project addresses the problem",
  codeBlock: "Add code examples using triple backticks to show usage",
  image: "Add images or screenshots to make your README more engaging",
  wikiLink: "Link to your GitHub wiki for detailed documentation",
  licenseLink: "Add a link to your LICENSE file (e.g., [MIT License](LICENSE))",
};

export default suggestions;
