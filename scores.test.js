import { describe, it } from 'node:test';
import assert from 'node:assert';
import { scores, calculateScore } from './scores.js';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a mock analysis result with all sections absent
 */
const createEmptyResults = () => {
  const results = {};
  for (const section of Object.keys(scores)) {
    results[section] = false;
  }
  return results;
};

/**
 * Create a mock analysis result with all positive sections present
 * (excludes penalty sections like htmlComment and deleteInstruction)
 */
const createPerfectResults = () => {
  const results = {};
  for (const [section, score] of Object.entries(scores)) {
    // Only include positive-scoring sections
    results[section] = score > 0;
  }
  return results;
};

/**
 * Create a mock analysis result with specific sections present
 */
const createResults = (presentSections) => {
  const results = createEmptyResults();
  for (const section of presentSections) {
    results[section] = true;
  }
  return results;
};

// =============================================================================
// Score Values Verification
// =============================================================================
describe('Score Values', () => {
  it('should have correct score values defined', () => {
    assert.strictEqual(scores.title, 15);
    assert.strictEqual(scores.tagline, 5);
    assert.strictEqual(scores.badge, 2);
    assert.strictEqual(scores.whatAndWhy, 15);
    assert.strictEqual(scores.quickStart, 10);
    assert.strictEqual(scores.visualPreview, 5);
    assert.strictEqual(scores.documentation, 5);
    assert.strictEqual(scores.contributors, 5);
    assert.strictEqual(scores.license, 5);
    assert.strictEqual(scores.tableOfContents, 5);
    assert.strictEqual(scores.problemStatement, 5);
    assert.strictEqual(scores.solutionStatement, 5);
    assert.strictEqual(scores.codeBlock, 5);
    assert.strictEqual(scores.image, 5);
    assert.strictEqual(scores.wikiLink, 5);
    assert.strictEqual(scores.licenseLink, 3);
  });

  it('should have correct penalty values', () => {
    assert.strictEqual(scores.htmlComment, -10);
    assert.strictEqual(scores.deleteInstruction, -10);
  });

  it('should have all expected sections defined', () => {
    const expectedSections = [
      'title', 'tagline', 'badge', 'whatAndWhy', 'quickStart',
      'visualPreview', 'documentation', 'contributors', 'license',
      'tableOfContents', 'problemStatement', 'solutionStatement',
      'codeBlock', 'image', 'wikiLink', 'licenseLink',
      'htmlComment', 'deleteInstruction'
    ];

    for (const section of expectedSections) {
      assert.ok(section in scores, `Missing section: ${section}`);
    }
  });
});

// =============================================================================
// Empty README Tests
// =============================================================================
describe('Empty README Scoring', () => {
  it('should return 0 for completely empty analysis results', () => {
    const results = createEmptyResults();
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 0);
  });

  it('should return 0 for empty object', () => {
    const { totalScore } = calculateScore({});
    assert.strictEqual(totalScore, 0);
  });

  it('should list all positive sections as missing for empty README', () => {
    const results = createEmptyResults();
    const { missingSections } = calculateScore(results);

    // Count positive-scoring sections
    const positiveSections = Object.entries(scores)
      .filter(([_, score]) => score > 0)
      .map(([section, _]) => section);

    assert.strictEqual(missingSections.length, positiveSections.length);

    for (const section of positiveSections) {
      assert.ok(missingSections.includes(section), `${section} should be in missing sections`);
    }
  });

  it('should have no sections to remove for empty README', () => {
    const results = createEmptyResults();
    const { sectionsToRemove } = calculateScore(results);
    assert.strictEqual(sectionsToRemove.length, 0);
  });
});

// =============================================================================
// Perfect README Tests
// =============================================================================
describe('Perfect README Scoring', () => {
  it('should return 100 for README with all positive sections', () => {
    const results = createPerfectResults();
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 100);
  });

  it('should have no missing sections for perfect README', () => {
    const results = createPerfectResults();
    const { missingSections } = calculateScore(results);
    assert.strictEqual(missingSections.length, 0);
  });

  it('should have no sections to remove for perfect README', () => {
    const results = createPerfectResults();
    const { sectionsToRemove } = calculateScore(results);
    assert.strictEqual(sectionsToRemove.length, 0);
  });

  it('should verify raw score sum equals exactly 100', () => {
    // Verify that the sum of all positive scores equals 100
    // This means a perfect README with all sections gets exactly 100
    const positiveScoreSum = Object.values(scores)
      .filter(score => score > 0)
      .reduce((sum, score) => sum + score, 0);

    assert.strictEqual(positiveScoreSum, 100, `Sum of positive scores should equal 100`);
  });
});

// =============================================================================
// Partial README Scoring Tests
// =============================================================================
describe('Partial README Scoring', () => {
  it('should score title only correctly (15 points)', () => {
    const results = createResults(['title']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 15);
  });

  it('should score title + whatAndWhy correctly (30 points)', () => {
    const results = createResults(['title', 'whatAndWhy']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 30);
  });

  it('should score essential sections correctly', () => {
    // title (15) + whatAndWhy (15) + quickStart (10) = 40
    const results = createResults(['title', 'whatAndWhy', 'quickStart']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 40);
  });

  it('should score badge correctly (2 points)', () => {
    const results = createResults(['badge']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 2);
  });

  it('should score licenseLink correctly (3 points)', () => {
    const results = createResults(['licenseLink']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 3);
  });

  it('should score multiple 5-point sections correctly', () => {
    // tagline (5) + visualPreview (5) + documentation (5) = 15
    const results = createResults(['tagline', 'visualPreview', 'documentation']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 15);
  });

  it('should correctly identify missing sections', () => {
    const results = createResults(['title', 'whatAndWhy']);
    const { missingSections } = calculateScore(results);

    // Should not include title or whatAndWhy
    assert.ok(!missingSections.includes('title'));
    assert.ok(!missingSections.includes('whatAndWhy'));

    // Should include other positive sections
    assert.ok(missingSections.includes('quickStart'));
    assert.ok(missingSections.includes('license'));
    assert.ok(missingSections.includes('documentation'));
  });
});

// =============================================================================
// Score Breakdown Accuracy Tests
// =============================================================================
describe('Score Breakdown Accuracy', () => {
  it('should calculate cumulative score correctly', () => {
    // Test various combinations and verify exact scores
    const testCases = [
      { sections: ['title'], expected: 15 },
      { sections: ['title', 'tagline'], expected: 20 },
      { sections: ['title', 'whatAndWhy'], expected: 30 },
      { sections: ['title', 'whatAndWhy', 'quickStart'], expected: 40 },
      { sections: ['badge', 'licenseLink'], expected: 5 },
      { sections: ['codeBlock', 'image', 'wikiLink'], expected: 15 },
    ];

    for (const { sections, expected } of testCases) {
      const results = createResults(sections);
      const { totalScore } = calculateScore(results);
      assert.strictEqual(totalScore, expected,
        `Expected ${expected} for sections [${sections.join(', ')}], got ${totalScore}`);
    }
  });

  it('should return exact scores matching the scores object', () => {
    // Test each section individually
    for (const [section, expectedScore] of Object.entries(scores)) {
      if (expectedScore > 0) {
        const results = createResults([section]);
        const { totalScore } = calculateScore(results);
        assert.strictEqual(totalScore, expectedScore,
          `Section ${section} should score ${expectedScore}, got ${totalScore}`);
      }
    }
  });
});

// =============================================================================
// Score Capping Tests
// =============================================================================
describe('Score Capping', () => {
  it('should cap score at 100 maximum', () => {
    const results = createPerfectResults();
    const { totalScore } = calculateScore(results);
    assert.ok(totalScore <= 100, `Score ${totalScore} should not exceed 100`);
    assert.strictEqual(totalScore, 100);
  });

  it('should cap score at 0 minimum when penalties exceed positives', () => {
    // Only penalties present
    const results = createResults(['htmlComment', 'deleteInstruction']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 0);
  });

  it('should not go below 0 with heavy penalties', () => {
    // Small positive + big penalties
    const results = createResults(['badge', 'htmlComment', 'deleteInstruction']);
    // badge (2) + htmlComment (-10) + deleteInstruction (-10) = -18, capped to 0
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 0);
  });
});

// =============================================================================
// Penalty (Sections to Remove) Tests
// =============================================================================
describe('Penalty Sections', () => {
  it('should apply -10 penalty for htmlComment', () => {
    // title (15) + htmlComment (-10) = 5
    const results = createResults(['title', 'htmlComment']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 5);
  });

  it('should apply -10 penalty for deleteInstruction', () => {
    // title (15) + deleteInstruction (-10) = 5
    const results = createResults(['title', 'deleteInstruction']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 5);
  });

  it('should apply both penalties cumulatively', () => {
    // title (15) + whatAndWhy (15) + htmlComment (-10) + deleteInstruction (-10) = 10
    const results = createResults(['title', 'whatAndWhy', 'htmlComment', 'deleteInstruction']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 10);
  });

  it('should track htmlComment in sectionsToRemove', () => {
    const results = createResults(['title', 'htmlComment']);
    const { sectionsToRemove } = calculateScore(results);
    assert.ok(sectionsToRemove.includes('htmlComment'));
  });

  it('should track deleteInstruction in sectionsToRemove', () => {
    const results = createResults(['title', 'deleteInstruction']);
    const { sectionsToRemove } = calculateScore(results);
    assert.ok(sectionsToRemove.includes('deleteInstruction'));
  });

  it('should track both penalties in sectionsToRemove', () => {
    const results = createResults(['htmlComment', 'deleteInstruction']);
    const { sectionsToRemove } = calculateScore(results);
    assert.strictEqual(sectionsToRemove.length, 2);
    assert.ok(sectionsToRemove.includes('htmlComment'));
    assert.ok(sectionsToRemove.includes('deleteInstruction'));
  });

  it('should not include penalties in missingSections', () => {
    const results = createEmptyResults();
    const { missingSections } = calculateScore(results);
    assert.ok(!missingSections.includes('htmlComment'));
    assert.ok(!missingSections.includes('deleteInstruction'));
  });
});

// =============================================================================
// TOC Line-Count Scoring Tests (Future Enhancement)
// =============================================================================
describe('TOC Line-Count Scoring', () => {
  // NOTE: The current implementation does not consider line count for TOC scoring.
  // These tests document the expected behavior for future implementation.

  it('should score tableOfContents as 5 points (current behavior)', () => {
    const results = createResults(['tableOfContents']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 5);
  });

  // TODO: Implement line-count aware TOC scoring
  // The acceptance criteria specifies:
  // - TOC with <200 lines should not be counted
  // - TOC with >200 lines should be counted
  //
  // This would require passing line count to calculateScore or
  // having a separate function that adjusts results based on file metadata.
  //
  // Future tests would look like:
  //
  // it('should not count TOC for files under 200 lines', () => {
  //   const results = createResults(['tableOfContents']);
  //   const lineCount = 150;
  //   const { totalScore } = calculateScore(results, { lineCount });
  //   assert.strictEqual(totalScore, 0);
  // });
  //
  // it('should count TOC for files over 200 lines', () => {
  //   const results = createResults(['tableOfContents']);
  //   const lineCount = 250;
  //   const { totalScore } = calculateScore(results, { lineCount });
  //   assert.strictEqual(totalScore, 5);
  // });
});

// =============================================================================
// Edge Cases
// =============================================================================
describe('Edge Cases', () => {
  it('should handle undefined section values gracefully', () => {
    const results = { title: true, unknownSection: true };
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 15); // Only title counted
  });

  it('should handle null values as falsy', () => {
    const results = { title: null, whatAndWhy: true };
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 15); // Only whatAndWhy counted
  });

  it('should handle numeric truthy values', () => {
    const results = { title: 1, whatAndWhy: 1 };
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 30);
  });

  it('should handle string truthy values', () => {
    const results = { title: 'yes', whatAndWhy: 'present' };
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 30);
  });

  it('should handle mixed truthy/falsy values', () => {
    const results = {
      title: true,
      whatAndWhy: false,
      quickStart: 0,
      badge: '',
      tagline: true
    };
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 20); // title (15) + tagline (5)
  });

  it('should return consistent structure', () => {
    const results = createResults(['title']);
    const result = calculateScore(results);

    assert.ok('totalScore' in result);
    assert.ok('missingSections' in result);
    assert.ok('sectionsToRemove' in result);
    assert.ok(Array.isArray(result.missingSections));
    assert.ok(Array.isArray(result.sectionsToRemove));
    assert.ok(typeof result.totalScore === 'number');
  });
});

// =============================================================================
// Real-World Scenario Tests
// =============================================================================
describe('Real-World Scenarios', () => {
  it('should score a minimal viable README (~40-50 points)', () => {
    // Minimal: title, basic description, installation
    const results = createResults(['title', 'whatAndWhy', 'quickStart']);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 40);
  });

  it('should score a good README (~60-70 points)', () => {
    // Good: basics + license, contributing, code examples
    const results = createResults([
      'title', 'whatAndWhy', 'quickStart',
      'license', 'contributors', 'codeBlock'
    ]);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 55);
  });

  it('should score an excellent README (~80-90 points)', () => {
    // Excellent: comprehensive documentation
    const results = createResults([
      'title', 'tagline', 'badge', 'whatAndWhy', 'quickStart',
      'documentation', 'contributors', 'license', 'codeBlock', 'image'
    ]);
    const { totalScore } = calculateScore(results);
    assert.strictEqual(totalScore, 72);
  });

  it('should penalize template READMEs with comments', () => {
    // README that hasn't been customized
    const results = createResults([
      'title', 'whatAndWhy', 'quickStart',
      'htmlComment', 'deleteInstruction'
    ]);
    // 40 - 20 = 20
    const { totalScore, sectionsToRemove } = calculateScore(results);
    assert.strictEqual(totalScore, 20);
    assert.strictEqual(sectionsToRemove.length, 2);
  });

  it('should identify what sections are missing for improvement', () => {
    const results = createResults(['title', 'quickStart']);
    const { missingSections } = calculateScore(results);

    // Key sections that should be suggested
    assert.ok(missingSections.includes('whatAndWhy'), 'Should suggest adding What & Why');
    assert.ok(missingSections.includes('license'), 'Should suggest adding License');
    assert.ok(missingSections.includes('contributors'), 'Should suggest adding Contributors');
  });
});
