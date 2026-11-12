import test from 'node:test';
import assert from 'node:assert/strict';

import { validateActiveContent } from '../scripts/validate-content.mjs';

test('контент проходит валидацию без ошибок', () => {
  const { errors, warnings, stats } = validateActiveContent();

  assert.deepEqual(errors, []);
  assert.equal(warnings.length, 0);
  assert.ok(stats.locations > 0);
  assert.ok(stats.scenes > 0);
  assert.ok(stats.transitions > 0);
  assert.equal(stats.reachableScenes, stats.scenes, 'все сцены должны быть достижимы');
});
