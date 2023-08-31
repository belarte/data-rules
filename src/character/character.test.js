import { describe, it, expect } from 'vitest';

import Immutable from 'immutable';

import * as character from './character.js';

describe("A character's hp", () => {
  it('should be 0 when currentHP is 0', () => {
    const player = Immutable.fromJS({ stats: { currentHP: 0, maxHP: 100 } });
    expect(character.hp(player)).toBe(0);
  });

  it('should be 0.5 when currentHP is half', () => {
    const player = Immutable.fromJS({ stats: { currentHP: 50, maxHP: 100 } });
    expect(character.hp(player)).toBe(0.5);
  });

  it('should be 1 when currentHP is full', () => {
    const player = Immutable.fromJS({ stats: { currentHP: 100, maxHP: 100 } });
    expect(character.hp(player)).toBe(1);
  });
});

describe("A character's bag", () => {
  it('should contain a potion when the character has one', () => {
    const player = Immutable.fromJS({
      bag: { 'health-potion': { quantity: 1 } }
    });
    expect(character.carries(player, 'health-potion')).toBeTruthy();
  });

  it('should contain a potion when the character has more than one', () => {
    const player = Immutable.fromJS({
      bag: { 'health-potion': { quantity: 7 } }
    });
    expect(character.carries(player, 'health-potion')).toBeTruthy();
  });

  it('should contain a potion when the character carries many things', () => {
    const player = Immutable.fromJS({ bag: {
      'health-potion': { quantity: 1 },
      'mana-potion': { quantity: 1 },
      'rusted-sword': { quantity: 1 },
    } });
    expect(character.carries(player, 'health-potion')).toBeTruthy();
  });

  it('should not contain a potion when the character has nothing', () => {
    const player = Immutable.fromJS({ bag: [] });
    expect(character.carries(player, 'health-potion')).toBeFalsy();
  });

  it('should not contain a potion when the character has used them all', () => {
    const player = Immutable.fromJS({
      bag: { 'health-potion': { quantity: 0 } }
    });
    expect(character.carries(player, 'health-potion')).toBeFalsy();
  });

  it('should not contain a potion when the character carries something else', () => {
    const player = Immutable.fromJS({
      bag: { 'mana-potion': { quantity: 0 } }
    });
    expect(character.carries(player, 'health-potion')).toBeFalsy();
  });
});

describe('A character using a potion', () => {
  it('should increase his HP', () => {
    const player = Immutable.fromJS({
      stats: { currentHP: 50, maxHP: 100 },
      bag: { 'health-potion': { potency: 30, quantity: 1 } },
    });
    const expected = {
      stats: { currentHP: 80, maxHP: 100 },
      bag: {},
    };
    expect(character.use(player, 'health-potion').toJS()).toStrictEqual(expected);
  });

  it('should only use one potion', () => {
    const player = Immutable.fromJS({
      stats: { currentHP: 50, maxHP: 100 },
      bag: { 'health-potion': { potency: 30, quantity: 7 } },
    });
    const expected = {
      stats: { currentHP: 80, maxHP: 100 },
      bag: { 'health-potion': { potency: 30, quantity: 6 } },
    };
    expect(character.use(player, 'health-potion').toJS()).toStrictEqual(expected);
  });

  it('should increase his HP but not above the maximum', () => {
    const player = Immutable.fromJS({
      stats: { currentHP: 10, maxHP: 30 },
      bag: { 'health-potion': { potency: 30, quantity: 1 } },
    });
    const expected = {
      stats: { currentHP: 30, maxHP: 30 },
      bag: {},
    };
    expect(character.use(player, 'health-potion').toJS()).toStrictEqual(expected);
  });
});

