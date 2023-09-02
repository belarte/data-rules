import { describe, it, expect } from 'vitest';

import { parse } from './parser.js';

const idle = `idle { wait }`;

const drinkPotion = `
drink-potion {
    when
        hp below 50%;
        carries health-potion;
    then
        use health-potion
}`;

const healSelf = `
heal-self {
    when
        hp below 50%;
        equipped spells.heal;
        mp above spells.heal.cost;
    then
        cast heal self
}`;

const output = {
  idle: {
    conditions: [],
    action: {
      name: 'wait',
      args: [],
    },
  },

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

  "heal-self": {
    conditions: [
      {
        name: "hp",
        args: ["below", 0.5],
      },
      {
        name: "equipped",
        args: [["spells", "heal"]],
      },
      {
        name: "mp",
        args: ["above", ["spells", "heal", "cost"]],
      }
    ],
    action: {
      name: "cast",
      args: ["heal", "self"],
    },
  },
};

describe('The parser', () => {
  it.each([
    ['idle', idle],
    ['drink-potion', drinkPotion],
    ['heal-self', healSelf]
  ])('should parse %s', (name, input) => {
    const parsed = parse(input);
    expect(Object.keys(parsed)).toHaveLength(1);
    expect(parsed[name]).toStrictEqual(output[name]);
  });

  it('should parse multiple behaviors', () => {
    const parsed = parse(idle + "\n\n" + drinkPotion);
    const unwrap = ({idle, 'drink-potion': drink}) => ({idle, 'drink-potion': drink});
    expect(Object.keys(parsed)).toHaveLength(2);
    expect(parsed).toStrictEqual(unwrap(output));
  });
});
