import { SystemState } from "./system.js";

export class Game {
  constructor() {
    this.state = new SystemState();
    this.state.loadBehaviors();
  }

  addCharacter(team, name, character) {
    var previous = this.state.get();
    var next = previous.setIn(['characters', team, name], character);
    this.state.commit(next);
  }

  play(team, player) {
    var previous = this.state.get();
    const behavior = previous.getIn(['characters', team, player, 'behavior']);
    evaluateRule(previous, behavior);
    this.state.commit(previous);
  }
}

const evaluateRule = (state, behavior) => {
  const evaluatedCondition = state
    .getIn(['behaviors', behavior, 'conditions'])
    .every(_ => true);

  if (evaluatedCondition) {
    const action = state.getIn(['behaviors', behavior, 'action', 'name']);
    return library[action](state);
  }

  return state;
}

const library = {
  wait: (state) => {
    return state;
  },
};
