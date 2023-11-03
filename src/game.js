import fs from "fs";
import { fromJS } from "immutable";

import { SystemState } from "src/system.js";
import { parse } from "src/behavior/parser.js";
import { library } from "src/library/library.js";

export class Game {
    constructor() {
        this.state = new SystemState();
        this.loadBehaviors();
    }

    loadBehaviors() {
        const file = fs.readFileSync("resources/behaviors.dsl", "utf8");
        const behaviors = parse(file);

        const previous = this.state.get();
        const next = previous.set("behaviors", fromJS(behaviors));
        this.state.commit(next);
    }

    addCharacter(team, name, character) {
        var previous = this.state.get();
        var next = previous.setIn(["characters", team, name], fromJS(character));
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
    const [evaluatedCondition, additionalInfo] = state
        .getIn(["behaviors", behavior, "conditions"])
        .reduce(([currentRes, currentInfo], c) => {
            const [res, info] = evaluateFunction(state, playerPath, c);
            return [currentRes && res, { ...currentInfo, ...info }];
        }, [true, {}]);

    if (evaluatedCondition) {
        const action = state.getIn(["behaviors", behavior, "action"]);
        const stateWithAdditionalInfo = state.set("additionalInfo", fromJS(additionalInfo));
        return evaluateFunction(stateWithAdditionalInfo, playerPath, action);
    }

    return state;
};

const evaluateFunction = (state, playerPath, condition) => {
    const name = condition.get("name");
    const args = condition.get("args");
    return library[name](state, playerPath, ...args);
};
