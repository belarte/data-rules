import { describe, it, expect } from 'vitest';

import { Game } from './game.js';

describe('The game', () => {
  const game = new Game();
  const behaviors = game.state.get().get('behaviors').keySeq().toJS();

  it.each([
    ['idle'],
    ['drink-potion'],
    ['heal-self'],
  ])('should load behavior %s', (behavior) => { 
    expect(behaviors).toContain(behavior);
  });
});

describe('A character with idle behavior', () => {
  const game = new Game();
  game.addCharacter('Blue Team', 'Blue', { behavior: 'idle' });

  it('should not modify the game when playing', () => {
    const before = game.state.get();
    game.play('Blue Team', 'Blue');
    const after = game.state.get();

    expect(before).toStrictEqual(after);
  });
});

describe('A character with drink-potion behavior', () => {
  const game = new Game();

  const buildCharacter = (currentHP, potionQuantity) => ({
    behavior: 'drink-potion',
    stats: {
      currentHP,
      maxHP: 100,
    },
    bag: {
      ...(potionQuantity > 0) && { 'health-potion': { potency: 30, quantity: potionQuantity } },
    },
  });

  it('should not drink a potion when his bag is empty', () => {
    const character = buildCharacter(49, 0);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(character);
  });

  it('should not drink a potion when his life is high', () => {
    const character = buildCharacter(51, 1);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(character);
  });

  it('should drink a potion when his life is low', () => {
    const character = buildCharacter(49, 1);
    const expected = buildCharacter(79, 0);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(expected);
  });
});

describe('A character with heal-self behavior', () => {
  const game = new Game();

  const buildCharacter = (currentHP, currentMP, hasHeal) => ({
    behavior: 'heal-self',
    stats: {
      currentHP,
      maxHP: 100,
      currentMP,
    },
    equippement: {
      spells: {
        ...(hasHeal) && { 'heal': { potency: 20, cost: 4 } },
      },
    },
  });

  it('should not heal when the spell is not equipped', () => {
    const character = buildCharacter(100, 10, false);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(character);
  });

  it('should not heal a potion when his life is full', () => {
    const character = buildCharacter(100, 10, true);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(character);
  });

  it('should heal when his life is low', () => {
    const character = buildCharacter(49, 10, true);
    const expected = buildCharacter(69, 6, true);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    expect(after).toStrictEqual(expected);
  });
});
