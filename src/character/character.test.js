import { describe, it, expect } from 'vitest';

import Immutable from 'immutable';

import * as character from 'src/character/character.js';

describe("A character's hp", () => {
  it.each([
    [0, 0, 100],
    [0.25, 25, 100],
    [0.5, 50, 100],
    [0.75, 75, 100],
    [1, 100, 100],
  ])("should be %d when hp are %d/%d", (expected, currentHP, maxHP) => {
    const player = Immutable.fromJS({ stats: { currentHP, maxHP } });
    expect(character.hp(player)).toBe(expected);
  });
});

describe("A character's mp", () => {
  it.each([
    [0],
    [1],
    [4],
    [10],
  ])("should be %d when hp are %d/%d", (currentMP) => {
    const player = Immutable.fromJS({ stats: { currentMP } });
    expect(character.mp(player)).toBe(currentMP);
  });
});

describe("A character's bag", () => {
  it.each([
    [ { 'health-potion': { quantity: 1 } } ],
    [ { 'health-potion': { quantity: 7 } } ],
    [ { 'health-potion': { quantity: 1 }, 'mana-potion': { quantity: 1 } } ],
  ])("should contain a potion when the player carries %o", (bag) => {
    const player = Immutable.fromJS({ bag });
    expect(character.carries(player, 'health-potion')).toBeTruthy();
  });

  it.each([
    [ {} ],
    [ { 'health-potion': { quantity: 0 } } ],
    [ { 'mana-potion': { quantity: 1 } } ],
  ])(`should not contain a potion when the player carries %o`, (bag) => {
    const player = Immutable.fromJS({ bag });
    expect(character.carries(player, 'health-potion')).toBeFalsy();
  });
});

describe('When a character uses a potion', () => {
  const player = Immutable.fromJS({
    stats: { currentHP: 50, maxHP: 100 },
    bag: { 'health-potion': { potency: 30, quantity: 7 } },
  });

  it('should increase his HP', () => {
    const playerAfter = character.use(player, 'health-potion');
    expect(playerAfter.getIn(['stats', 'currentHP'])).toBe(80);
  });

  it('should increase his HP but not above the maximum', () => {
    const playerAfter = character.use(
      character.use(player, 'health-potion'), 'health-potion');
    expect(playerAfter.getIn(['stats', 'currentHP'])).toBe(100);
  });

  it('should only use one potion', () => {
    const playerAfter = character.use(player, 'health-potion');
    expect(playerAfter.getIn(['bag', 'health-potion', 'quantity'])).toBe(6);
  });
});

describe('When checking if a character equips a spell', () => {
  it('should return false if spell is not equipped', () => {
    const player = Immutable.fromJS({ equippement: { spells: {} } });
    const equipped = character.equipped(player, ['spells', 'heal']);
    expect(equipped).toBeFalsy();
  });

  it('should return true if spell is equipped', () => {
    const player = Immutable.fromJS({ equippement: { spells: { 'heal': {} } } });
    const equipped = character.equipped(player, ['spells', 'heal']);
    expect(equipped).toBeTruthy();
  });
});

describe('When a character casts a spell', () => {
  const player = Immutable.fromJS({
    stats: { currentHP: 70, maxHP: 100, currentMP: 10, maxMP: 10 },
    equippement: { spells: { 'heal': { potency: 20, cost: 4 } } },
  });

  it('should increase his HP', () => {
    const playerAfter = character.cast(player, 'heal');
    expect(playerAfter.getIn(['stats', 'currentHP'])).toBe(90);
    expect(playerAfter.getIn(['stats', 'currentMP'])).toBe(6);
  });

  it('should increase his HP but not above the maximum', () => {
    const playerAfter = character.cast(
      character.cast(player, 'heal'), 'heal');
    expect(playerAfter.getIn(['stats', 'currentHP'])).toBe(100);
    expect(playerAfter.getIn(['stats', 'currentMP'])).toBe(2);
  });
});