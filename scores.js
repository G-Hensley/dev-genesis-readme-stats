// Scores assigned to each README section or element
const scores = {
  title: 15,
  tagline: 5,
  badge: 2,
  whatAndWhy: 15,
  quickStart: 10,
  visualPreview: 5,
  documentation: 5,
  contributors: 5,
  license: 5,
  tableOfContents: 5,
  problemStatement: 5,
  solutionStatement: 5,
  codeBlock: 5,
  image: 5,
  wikiLink: 5,
  licenseLink: 3,
  htmlComment: -10,
  deleteInstruction: -10,
}

/**
 * Calculate total score based on analysis results
 * @param {Object} analysisResults - Object where keys are section names and values are booleans indicating presence
 * @returns {Object} Object containing totalScore (capped at 100) and missingSections array
 */
const calculateScore = (analysisResults) => {
  let totalScore = 0;
  let missingSections = [];
  let sectionsToRemove = [];
  for (const [section, present] of Object.entries(analysisResults)) {
    if (present && scores[section]) {
      totalScore += scores[section];
      if (scores[section] < 0) {
        sectionsToRemove.push(section);
      }
    } else if (!present && scores[section] && scores[section] > 0) {
      missingSections.push(section);
    }
  }
  return { totalScore: Math.max(0, Math.min(totalScore, 100)), missingSections, sectionsToRemove }; // Cap score between 0 and 100
};

export { scores, calculateScore };
