import { describe, it, expect } from 'vitest';

import { parse } from './parser.js';

const idle = `idle { wait }`;

const idleOutput = {
  idle: {
    conditions: [],
    action: {
      name: 'wait',
      args: [],
    },
  },
};

const drinkPotion = `
drink-potion {
    when
        hp below 50%;
        carries health-potion;
    then
        use health-potion
}`;

const drinkPotionOutput = {
  "drink-potion": {
    conditions: [
      {
        name: "hp",
        args: ["below", 0.5],
      },
      {
        name: "carries",
        args: ["health-potion"],
      },
    ],
    action: {
      name: "use",
      args: ["health-potion"],
    },
  },
};

describe('The parser', () => {
  it('should parse idle', () => {
    const output = parse(idle);
    expect(output).toStrictEqual(idleOutput);
  });

  it('should parse drink-potion', () => {
    const output = parse(drinkPotion);
    expect(output).toStrictEqual(drinkPotionOutput);
  });

  it('should parse multiple behaviors', () => {
    const output = parse(idle + "\n\n" + drinkPotion);
    expect(output).toStrictEqual({
      ...idleOutput,
      ...drinkPotionOutput,
    });
  });
});
