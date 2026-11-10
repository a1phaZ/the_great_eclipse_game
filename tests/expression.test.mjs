import test from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateExpression,
  parseExpression,
  ExpressionError,
} from '../tgcloud/lib/engine/expression.js';

function scopeWith(values = {}) {
  return {
    get(name) {
      if (Object.prototype.hasOwnProperty.call(values, name)) return values[name];
      return 0;
    },
    call(name, args) {
      const functions = {
        min: (...args) => Math.min(...args),
        max: (...args) => Math.max(...args),
        round: (value) => Math.round(value),
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),
      };
      if (!functions[name]) throw new Error(`unknown ${name}`);
      return functions[name](...args);
    },
  };
}

test('арифметика и приоритет операций', () => {
  assert.equal(evaluateExpression('2 + 3 * 4', scopeWith()), 14);
  assert.equal(evaluateExpression('(2 + 3) * 4', scopeWith()), 20);
  assert.equal(evaluateExpression('-10 + 3', scopeWith()), -7);
  assert.equal(evaluateExpression('10 / 2', scopeWith()), 5);
  assert.equal(evaluateExpression('10 % 3', scopeWith()), 1);
});

test('деление на ноль безопасно', () => {
  assert.equal(evaluateExpression('10 / 0', scopeWith()), 0);
  assert.equal(evaluateExpression('10 % 0', scopeWith()), 0);
});

test('сравнения, логика и тернарник', () => {
  assert.equal(evaluateExpression('2 < 3', scopeWith()), true);
  assert.equal(evaluateExpression('2 >= 3', scopeWith()), false);
  assert.equal(evaluateExpression('2 == 2 && 3 != 4', scopeWith()), true);
  assert.equal(evaluateExpression('!0', scopeWith()), true);
  assert.equal(evaluateExpression('1 ? "да" : "нет"', scopeWith()), 'да');
});

test('пути состояния и derived-значения через scope', () => {
  const scope = scopeWith({
    'resources.chips': 120,
    'vars.maxHp': 250,
    'resources.hp': 100,
  });

  assert.equal(evaluateExpression('resources.chips >= 100', scope), true);
  assert.equal(evaluateExpression('vars.maxHp - resources.hp', scope), 150);
});

test('функции min/max/round/clamp', () => {
  const scope = scopeWith();
  assert.equal(evaluateExpression('max(1, round(500 * 0.002))', scope), 1);
  assert.equal(evaluateExpression('min(40, 15 + 3 * 2)', scope), 21);
  assert.equal(evaluateExpression('clamp(150, 0, 100)', scope), 100);
});

test('строки и конкатенация', () => {
  const scope = scopeWith();
  assert.equal(evaluateExpression('"a" + "b"', scope), 'ab');
  assert.equal(evaluateExpression('"x" + 5', scope), 'x5');
});

test('неизвестная функция — ошибка', () => {
  assert.throws(() => evaluateExpression('unknown(1)', scopeWith()), /unknown/);
});

test('битое выражение даёт ExpressionError с позицией', () => {
  assert.throws(() => parseExpression('1 +'), ExpressionError);
  assert.throws(() => parseExpression('(1 + 2'), ExpressionError);
});
