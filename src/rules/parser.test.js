import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

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

describe('The parser', () => {
  it('should parse a simple rule', () => {
    const output = parse(idle);
    assert.deepEqual(output, idleOutput);
  });
});
