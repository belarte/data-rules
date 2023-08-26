import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SystemState } from './system.js';

describe('The system', () => {
  const system = new SystemState({});
  system.loadBehaviors();

  it('should load behaviors', () => {
    const keys = Object.keys(system.get()['behaviors']);
    assert.ok(keys.includes('idle'));
  });
});