import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Game } from './game.js';

describe('The game', () => {
  const game = new Game();

  it('should load behaviors', () => {
    const behaviors = game.state.get().get('behaviors').keySeq();

    assert.ok(
      ['idle', 'drink-potion'].every(i => behaviors.includes(i))
    );
  });
});

describe('A character with idle behavior', () => {
  const game = new Game();
  game.addCharacter('Blue Team', 'Blue', { behavior: 'idle' });

  it('should not modify the game when playing', () => {
    const before = game.state.get();
    game.play('Blue Team', 'Blue');
    const after = game.state.get();

    assert.deepEqual(before, after);
  });
});

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

describe('A character with drink-potion behavior', () => {
  const game = new Game();

  it('should not drink a potion when his life is full', () => {
    const character = buildCharacter(100, 1);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    assert.deepEqual(after, character);
  });

  it('should drink a potion when his life is low', () => {
    const character = buildCharacter(49, 1);
    const expected = buildCharacter(79, 0);
    game.addCharacter('Blue Team', 'Blue', character);
    game.play('Blue Team', 'Blue');

    const after = game.state.get().getIn(['characters', 'Blue Team', 'Blue']).toJS();
    assert.deepEqual(after, expected);
  });
});
