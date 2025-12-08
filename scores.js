// TODO: Create scoring algorithm that assigns points based on detected sections score 1-100

const scores = {
  title: 15,
  tagline: 5,
  badges: 2,
  horizaontalRule: 1,
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

const calculateScore = (analysisResults) => {
  let totalScore = 0;
  for (const [section, present] of Object.entries(analysisResults)) {
    if (present && scores[section]) {
      totalScore += scores[section];
    }
  }
  return Math.min(totalScore, 100); // Cap score at 100
}
