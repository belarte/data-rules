import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Game } from './game.js';

describe('The game', () => {
  const game = new Game();

  it('should load behaviors', () => {
    assert.ok(
      game.state.get().get('behaviors').has('idle')
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