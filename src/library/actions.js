import * as character from "src/character/character.js";
import { validate } from "src/validation/validation.js";
import { stateSchema, stringSchema, pathSchema, targetSchema } from "src/library/schema.js";

const wait = state => {
  return state;
};

const use = (state, playerPath, item) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, stringSchema],
    minItems: 3,
    maxItems: 3,
  };

  const fun = (state, playerPath, item) => {
    const player = state.getIn(["characters", ...playerPath]);
    const nextPlayer = character.use(player, item);
    return state.setIn(["characters", ...playerPath], nextPlayer);
  };

  return validate(schema, stateSchema, fun, state, playerPath, item);
};

const cast = (state, playerPath, spell, target) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, stringSchema, targetSchema],
    minItems: 4,
    maxItems: 4,
  };

  const fun = (state, playerPath, spell, target) => {
    switch (target) {
      case "self":
        const [player, effect] = character.cast(state.getIn(["characters", ...playerPath]), spell);
        const nextPlayer = applyEffect(player, effect);
        return state.setIn(["characters", ...playerPath], nextPlayer);
      default:
        throw new Error(`Unknown target "${target}"`);
    }
  };

  return validate(schema, stateSchema, fun, state, playerPath, spell, target);
};

const applyEffect = (player, effect) => {
  const [operation, path, value] = effect;
  const nextPlayer = player.updateIn(path, stat => operations[operation](stat, value));
  return nextPlayer;
};

const operations = {
  add: (a, b) => a + b,
};

export const actions = {
  wait,
  use,
  cast,
};
