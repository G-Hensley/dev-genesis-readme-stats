// Scores assigned to each README section or element
const scores = {
  title: 15,
  tagline: 5,
  badges: 2,
  horizontalRule: 1,
  whatAndWhy: 15,
  quickStart: 10,
  visualPreview: 5,
  documentation: 5,
  contributors: 5,
  license: 5,
  tableOfContents: 5,
  problemStatement: 5,
  solutionStatement: 5,
  codeBlocks: 5,
  images: 5,
  wikiLink: 5,
  licenseLink: 3,
  htmlComment: -10,
  deleteInstruction: -10,
}

// Function to calculate total score based on analysis results
const calculateScore = (analysisResults) => {
  let totalScore = 0;
  let missingCategories = [];
  for (const [section, present] of Object.entries(analysisResults)) {
    if (present && scores[section]) {
      totalScore += scores[section];
    } else if (!present && scores[section] && scores[section] > 0) {
      missingCategories.push(section);
    }
  }
  return Math.min(totalScore, 100), missingCategories; // Cap score at 100
};

export default calculateScore;
