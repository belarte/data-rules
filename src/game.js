import fs from "fs";
import Immutable from "immutable";

import { SystemState } from "src/system.js";
import { parse } from "src/behavior/parser.js";
import * as library from "src/library/library.js";

export class Game {
  constructor() {
    this.state = new SystemState();
    this.loadBehaviors();
  }

  loadBehaviors() {
    const file = fs.readFileSync("resources/behaviors.dsl", "utf8");
    const behaviors = parse(file);

    const previous = this.state.get();
    const next = previous.set("behaviors", Immutable.fromJS(behaviors));
    this.state.commit(next);
  }

  addCharacter(team, name, character) {
    var previous = this.state.get();
    var next = previous.setIn(["characters", team, name], Immutable.fromJS(character));
    this.state.commit(next);
  }

  play(team, player) {
    var previous = this.state.get();
    const behavior = previous.getIn(["characters", team, player, "behavior"]);
    const next = evaluateRule(previous, [team, player], behavior);
    this.state.commit(next);
  }
}

const evaluateRule = (state, playerPath, behavior) => {
  const evaluatedCondition = state
    .getIn(["behaviors", behavior, "conditions"])
    .every(c => evaluateFunction(state, playerPath, c));

  if (evaluatedCondition) {
    const action = state.getIn(["behaviors", behavior, "action"]);
    return evaluateFunction(state, playerPath, action);
  }

  return state;
};

const evaluateFunction = (state, playerPath, condition) => {
  const name = condition.get("name");
  const args = condition.get("args");
  return library[name](state, playerPath, ...args);
};
