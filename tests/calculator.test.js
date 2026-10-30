import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, format } from '../calculator.js';

test('arithmetic precedence and parentheses', () => {
  assert.equal(calculate('2 + 3 * 4'), 14);
  assert.equal(calculate('(2+3)*4'), 20);
  assert.equal(calculate('2^3^2'), 512);
  assert.equal(calculate('-2^2'), -4);
  assert.equal(calculate('2^-3'), 0.125);
});
test('scientific notation, constants, functions and percentages', () => {
  assert.equal(calculate('6.02e23 / 2e+3'), 3.01e20);
  assert.equal(calculate('sqrt(81)+log(100)+50%'), 11.5);
  assert.ok(Math.abs(calculate('sin(pi/2)') - 1) < 1e-12);
  assert.equal(calculate('ln(e)'), 1);
  assert.equal(calculate('cos(0)+tan(0)'), 1);
  assert.equal(format(1234, true), '1.23400000e+3');
  assert.equal(format(3.01e20), '3.01e+20');
});
test('invalid input and non-real results produce useful errors', () => {
  for (const expression of ['1/0', 'sqrt(-1)', '2 +', 'sin(1', 'alert(1)', '2;3', '2 3', '2(3)', '']) {
    assert.throws(() => calculate(expression), Error, expression);
  }
});
