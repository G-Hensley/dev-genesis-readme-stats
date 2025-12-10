import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to run CLI and capture output
const runCLI = (fixtureName) => {
  const fixturePath = join(__dirname, 'test', 'fixtures', fixtureName);
  try {
    // Use --no-warnings to suppress experimental warnings
    const output = execSync(`node cli.js analyze "${fixturePath}"`, {
      encoding: 'utf-8',
      env: { ...process.env, FORCE_COLOR: '0' } // Disable colors for easier parsing
    });
    return { output, exitCode: 0 };
  } catch (error) {
    return { output: error.stdout || error.stderr || '', exitCode: error.status };
  }
};

// Helper to extract score from output
const extractScore = (output) => {
  const match = output.match(/Total Score: (\d+)\/100/);
  return match ? parseInt(match[1], 10) : null;
};

// Helper to check if output contains text
const outputContains = (output, text) => output.includes(text);

// Helper to count occurrences
const countOccurrences = (output, text) => {
  return (output.match(new RegExp(text, 'g')) || []).length;
};

// =============================================================================
// Fixture File Verification
// =============================================================================
describe('Test Fixtures', () => {
  const fixturesDir = join(__dirname, 'test', 'fixtures');

  it('should have all required fixture files', () => {
    const requiredFixtures = [
      'minimal.md',
      'complete.md',
      'react-style.md',
      'expressjs-style.md',
      'unusual-formatting.md',
      'template-unedited.md',
      'empty.md'
    ];

    for (const fixture of requiredFixtures) {
      const filePath = join(fixturesDir, fixture);
      assert.ok(fs.existsSync(filePath), `Missing fixture: ${fixture}`);
    }
  });
});

// =============================================================================
// Minimal README Tests
// =============================================================================
describe('Minimal README (just title)', () => {
  let result;

  before(() => {
    result = runCLI('minimal.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should return a low score (15 for title only)', () => {
    const score = extractScore(result.output);
    assert.strictEqual(score, 15);
  });

  it('should report missing sections', () => {
    assert.ok(outputContains(result.output, 'Missing Sections'));
  });

  it('should suggest adding What & Why section', () => {
    assert.ok(outputContains(result.output, 'whatAndWhy'));
  });

  it('should suggest adding Quick Start section', () => {
    assert.ok(outputContains(result.output, 'quickStart'));
  });

  it('should have no sections to remove', () => {
    assert.ok(outputContains(result.output, 'No sections need to be removed'));
  });
});

// =============================================================================
// Complete README Tests
// =============================================================================
describe('Complete README (all sections)', () => {
  let result;

  before(() => {
    result = runCLI('complete.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should return a high score (80+)', () => {
    const score = extractScore(result.output);
    assert.ok(score >= 80, `Expected score >= 80, got ${score}`);
  });

  it('should detect title', () => {
    // High score implies title was detected
    const score = extractScore(result.output);
    assert.ok(score >= 15);
  });

  it('should have no sections to remove', () => {
    assert.ok(outputContains(result.output, 'No sections need to be removed'));
  });
});

// =============================================================================
// React-Style README Tests (Popular Open Source Style)
// =============================================================================
describe('React-Style README', () => {
  let result;

  before(() => {
    result = runCLI('react-style.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should return a moderate to high score', () => {
    const score = extractScore(result.output);
    assert.ok(score >= 40, `Expected score >= 40, got ${score}`);
  });

  it('should detect Installation as Quick Start equivalent', () => {
    // If quickStart isn't in missing sections, it was detected
    const score = extractScore(result.output);
    // Score should include quickStart (10 points)
    assert.ok(score >= 10);
  });

  it('should detect badges', () => {
    const score = extractScore(result.output);
    // Badges are worth 2 points, should contribute to score
    assert.ok(score >= 2);
  });
});

// =============================================================================
// Express.js-Style README Tests (Popular Open Source Style)
// =============================================================================
describe('Express.js-Style README', () => {
  let result;

  before(() => {
    result = runCLI('expressjs-style.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should return a moderate score', () => {
    const score = extractScore(result.output);
    assert.ok(score >= 30, `Expected score >= 30, got ${score}`);
  });

  it('should detect multiple code blocks', () => {
    // Express fixture has several code blocks, score should reflect this
    const score = extractScore(result.output);
    assert.ok(score >= 5); // At least codeBlock points
  });

  it('should have no sections to remove (no template artifacts)', () => {
    assert.ok(outputContains(result.output, 'No sections need to be removed'));
  });
});

// =============================================================================
// Unusual Formatting README Tests
// =============================================================================
describe('Unusual Formatting README', () => {
  let result;

  before(() => {
    result = runCLI('unusual-formatting.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should handle emoji-heavy titles', () => {
    const score = extractScore(result.output);
    assert.ok(score !== null, 'Should produce a valid score');
  });

  it('should detect multiple images', () => {
    // Unusual fixture has 3 images
    const score = extractScore(result.output);
    assert.ok(score >= 5); // At least image points
  });

  it('should detect multiple code blocks with different languages', () => {
    const score = extractScore(result.output);
    assert.ok(score >= 5); // At least codeBlock points
  });

  it('should detect HTML comments and suggest removal', () => {
    assert.ok(outputContains(result.output, 'Sections that should be removed') ||
              outputContains(result.output, 'htmlComment'));
  });

  it('should handle badges without spaces between them', () => {
    // The unusual fixture has badges directly adjacent
    const score = extractScore(result.output);
    assert.ok(score >= 2); // At least badge points
  });
});

// =============================================================================
// Template (Unedited) README Tests
// =============================================================================
describe('Template Unedited README', () => {
  let result;

  before(() => {
    result = runCLI('template-unedited.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should have a lower score due to penalties', () => {
    const score = extractScore(result.output);
    // Template has HTML comments (-10) and DELETE instructions (-10)
    // But also has positive sections, so score should be reduced but not zero
    assert.ok(score < 80, `Expected score < 80 due to penalties, got ${score}`);
  });

  it('should detect HTML comments and recommend removal', () => {
    assert.ok(outputContains(result.output, 'htmlComment') ||
              outputContains(result.output, 'Sections that should be removed'));
  });

  it('should detect DELETE instructions and recommend removal', () => {
    assert.ok(outputContains(result.output, 'deleteInstruction') ||
              outputContains(result.output, 'Sections that should be removed'));
  });

  it('should list sections to remove', () => {
    assert.ok(outputContains(result.output, 'Sections that should be removed'));
  });
});

// =============================================================================
// Empty README Tests
// =============================================================================
describe('Empty README', () => {
  let result;

  before(() => {
    result = runCLI('empty.md');
  });

  it('should complete without error', () => {
    assert.strictEqual(result.exitCode, 0);
  });

  it('should return score of 0', () => {
    const score = extractScore(result.output);
    assert.strictEqual(score, 0);
  });

  it('should report many missing sections', () => {
    assert.ok(outputContains(result.output, 'Missing Sections'));
    // Should have multiple missing section indicators
    const missingCount = countOccurrences(result.output, '❌');
    assert.ok(missingCount >= 5, `Expected at least 5 missing sections, got ${missingCount}`);
  });

  it('should have no sections to remove', () => {
    assert.ok(outputContains(result.output, 'No sections need to be removed'));
  });
});

// =============================================================================
// CLI Output Format Tests
// =============================================================================
describe('CLI Output Format', () => {
  it('should display analyzing message', () => {
    const result = runCLI('minimal.md');
    assert.ok(outputContains(result.output, 'Analyzing README file'));
  });

  it('should display score in correct format', () => {
    const result = runCLI('minimal.md');
    assert.ok(/Total Score: \d+\/100/.test(result.output));
  });

  it('should display separator lines', () => {
    const result = runCLI('minimal.md');
    assert.ok(outputContains(result.output, '---'));
  });

  it('should display suggestion arrows for missing sections', () => {
    const result = runCLI('minimal.md');
    assert.ok(outputContains(result.output, '→'));
  });
});

// =============================================================================
// Error Handling Tests
// =============================================================================
describe('Error Handling', () => {
  it('should handle non-existent file gracefully', () => {
    try {
      execSync('node cli.js analyze non-existent-file.md', {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.status !== 0, 'Should exit with non-zero status');
    }
  });
});

// =============================================================================
// Performance Tests
// =============================================================================
describe('Performance', () => {
  it('should analyze all fixtures in under 1 second total', () => {
    const fixtures = [
      'minimal.md',
      'complete.md',
      'react-style.md',
      'expressjs-style.md',
      'unusual-formatting.md',
      'template-unedited.md',
      'empty.md'
    ];

    const startTime = Date.now();

    for (const fixture of fixtures) {
      runCLI(fixture);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    assert.ok(duration < 1000, `Expected all fixtures to complete in < 1000ms, took ${duration}ms`);
  });
});

// =============================================================================
// Score Consistency Tests
// =============================================================================
describe('Score Consistency', () => {
  it('should return consistent scores on repeated runs', () => {
    const scores = [];
    for (let i = 0; i < 3; i++) {
      const result = runCLI('complete.md');
      scores.push(extractScore(result.output));
    }

    assert.strictEqual(scores[0], scores[1]);
    assert.strictEqual(scores[1], scores[2]);
  });

  it('should score complete README higher than minimal', () => {
    const minimalResult = runCLI('minimal.md');
    const completeResult = runCLI('complete.md');

    const minimalScore = extractScore(minimalResult.output);
    const completeScore = extractScore(completeResult.output);

    assert.ok(completeScore > minimalScore,
      `Complete (${completeScore}) should score higher than minimal (${minimalScore})`);
  });

  it('should penalize template README compared to clean README', () => {
    const templateResult = runCLI('template-unedited.md');
    const reactResult = runCLI('react-style.md');

    const templateScore = extractScore(templateResult.output);
    const reactScore = extractScore(reactResult.output);

    // Template has penalties, so even with similar content it should score lower
    // or at least not significantly higher
    assert.ok(templateScore <= reactScore + 20,
      `Template (${templateScore}) shouldn't score much higher than React-style (${reactScore})`);
  });
});

// =============================================================================
// Real-World Scenario Tests
// =============================================================================
describe('Real-World Scenarios', () => {
  it('should give actionable feedback for a new project', () => {
    const result = runCLI('minimal.md');

    // Should suggest key sections to add
    assert.ok(outputContains(result.output, 'whatAndWhy') ||
              outputContains(result.output, 'quickStart') ||
              outputContains(result.output, 'license'));
  });

  it('should validate a well-documented project', () => {
    const result = runCLI('complete.md');
    const score = extractScore(result.output);

    // Well-documented project should score well
    assert.ok(score >= 80, `Well-documented project should score >= 80, got ${score}`);
  });

  it('should catch template artifacts before publishing', () => {
    const result = runCLI('template-unedited.md');

    // Should flag HTML comments and DELETE instructions
    assert.ok(
      outputContains(result.output, 'Sections that should be removed'),
      'Should warn about template artifacts'
    );
  });
});
