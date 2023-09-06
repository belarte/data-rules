import { describe, it, expect } from 'vitest';

import Immutable from 'immutable';

import { validate } from 'src/validation/validation.js';

const argsSchema = {
  type: 'array',
  items: [
    { type: 'number' },
    { type: 'array', items: { type: 'string' } },
    { type: 'object', properties: { p: { type: 'boolean' } } },
  ],
  minItems: 3,
  maxItems: 3,
};

const resSchema = {
  type: 'number',
};

const fun = (a1, _a2, _a3) => a1 % 2 === 0 ? 0 : '1';

describe("Validation", () => {
  it.each([
    [0, ['2'], {}],
    [0, ['2'], { p: true}],
    [0, ['2'], { z: 'whatever'}],
    [0, ['2'], Immutable.fromJS({})],
  ])("should be successful for %s, %s, %s", (a1, a2, a3) => {
    expect(_ => validate(argsSchema, resSchema, fun, a1, a2, a3))
      .not.toThrow();
  });

  it.each([
    ['0', ['2'], {}, /invalid argument/i],
    [0, '2', {}, /invalid argument/i],
    [0, [2], {}, /invalid argument/i],
    [0, ['2'], 0, /invalid argument/i],
    [0, ['2'], { p: 5 }, /invalid argument/i],
    [1, ['2'], {}, /invalid result/i],
  ])("should fail for %s, %s, %s", (a1, a2, a3, expected) => {
    expect(_ => validate(argsSchema, resSchema, fun, a1, a2, a3))
      .toThrow(expected);
  });

  it("Should fail for too few arguments", () => {
    expect(_ => validate(argsSchema, resSchema, fun, 0, ['2']))
      .toThrow(/invalid argument/i);
  });

  it("Should fail for too many arguments", () => {
    expect(_ => validate(argsSchema, resSchema, fun, 0, ['2'], {}, 0))
      .toThrow(/invalid argument/i);
  });
});

describe("Validation with object output", () => {
  const argOjectSchema = {
    type: 'array',
    items: [
      { type: 'object' },
    ],
    minItems: 1,
    maxItems: 1,
  };

  const resOjectSchema = {
    type: 'object',
  };

  it.each([
    [{}],
    [Immutable.fromJS({})],
  ])("should be successful for %s", (arg) => {
    expect(_ => validate(argOjectSchema, resOjectSchema, arg => arg, arg))
      .not.toThrow();
  });
});