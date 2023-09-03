import fs from 'fs';
import Immutable from 'immutable';

import { SystemState } from "./system.js";
import { parse } from './behavior/parser.js';
import * as character from './character/character.js';

export class Game {
  constructor() {
    this.state = new SystemState();
    this.loadBehaviors();
  }

  loadBehaviors() {
    const file = fs.readFileSync('./resources/behaviors.dsl', 'utf8');
    const behaviors = parse(file);

    const previous = this.state.get();
    const next = previous.set('behaviors', Immutable.fromJS(behaviors));
    this.state.commit(next);
  };

  addCharacter(team, name, character) {
    var previous = this.state.get();
    var next = previous.setIn(['characters', team, name], Immutable.fromJS(character));
    this.state.commit(next);
  }

  play(team, player) {
    var previous = this.state.get();
    const behavior = previous.getIn(['characters', team, player, 'behavior']);
    const next = evaluateRule(previous, [team, player], behavior);
    this.state.commit(next);
  }
}

const evaluateRule = (state, playerPath, behavior) => {
  const evaluatedCondition = state
    .getIn(['behaviors', behavior, 'conditions'])
    .every(c => evaluateFunction(state, playerPath, c));

  if (evaluatedCondition) {
    const action = state.getIn(['behaviors', behavior, 'action']);
    return evaluateFunction(state, playerPath, action);
  }

  return state;
};

const evaluateFunction = (state, playerPath, condition) => {
  const name = condition.get('name');
  const args = condition.get('args');
  return library[name](state, playerPath, ...args);
};

const comparators = {
  'below': (a, b) => a < b,
  'above': (a, b) => a > b,
};

const library = {
  wait: (state) => {
    return state;
  },

  use: (state, playerPath, item) => {
    const player = state.getIn(['characters', ...playerPath]);
    const nextPlayer = character.use(player, item);
    return state.setIn(['characters', ...playerPath], nextPlayer);
  },

  hp: (state, playerPath, comparator, value) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(['characters', ...playerPath]);
    return comparatorFn(character.hp(player), value);
  },

  mp: (state, playerPath, comparator, valuePath) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(['characters', ...playerPath]);
    const value = player.getIn(['equippement', ...valuePath]);
    return comparatorFn(character.mp(player), value);
  },

  equipped: (state, playerPath, path) => {
    const res = character.equipped(state.getIn(['characters', ...playerPath]), path);
    return res;
  },

  cast: (state, playerPath, spell) => {
    const nextPlayer = character.cast(state.getIn(['characters', ...playerPath]), spell);
    return state.setIn(['characters', ...playerPath], nextPlayer);
  },

  carries: (state, playerPath, item) => {
    const player = state.getIn(['characters', ...playerPath]);
    return character.carries(player, item);
  },
};
