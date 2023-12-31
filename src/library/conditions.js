import * as character from "src/character/character.js";
import { validate } from "src/validation/validation.js";
import {
  stateSchema,
  comparatorSchema,
  percentageSchema,
  conditionOutputSchema,
  stringSchema,
  pathSchema,
  playerPathSchema,
} from "src/library/schema.js";

const ally = (state, playerPath, condition, ...args) => {
  const schema = {
    type: "array",
    items: [stateSchema, playerPathSchema, stringSchema],
    minItems: 3,
    additionalItems: true,
  };

  const fun = (state, playerPath, condition, ...args) => {
    const [team, player] = playerPath;
    let target;
    const allies = state
      .getIn(["characters", team])
      .filter((_, name) => name !== player)
      .find((_, name) => {
        const [res] = conditions[condition](state, [team, name], ...args);
        if (res) target = [team, name];
        return res;
      });

    if (allies === undefined) {
      return [false, {}];
    }

    return [true, { target }];
  };

  return validate(schema, conditionOutputSchema, fun, state, playerPath, condition, ...args);
};

const hp = (state, playerPath, comparator, value) => {
  const schema = {
    type: "array",
    items: [stateSchema, playerPathSchema, comparatorSchema, percentageSchema],
    minItems: 4,
    maxItems: 4,
  };

  const fun = (state, playerPath, comparator, value) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(["characters", ...playerPath]);
    return [comparatorFn(character.hp(player), value)];
  };

  return validate(schema, conditionOutputSchema, fun, state, playerPath, comparator, value);
};

const mp = (state, playerPath, comparator, valuePath) => {
  const schema = {
    type: "array",
    items: [stateSchema, playerPathSchema, comparatorSchema, pathSchema],
    minItems: 4,
    maxItems: 4,
  };

  const fun = (state, playerPath, comparator, valuePath) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(["characters", ...playerPath]);
    const value = player.getIn(["equippement", ...valuePath]);
    return [comparatorFn(character.mp(player), value)];
  };

  return validate(schema, conditionOutputSchema, fun, state, playerPath, comparator, valuePath);
};

const equipped = (state, playerPath, path) => {
  const schema = {
    type: "array",
    items: [stateSchema, playerPathSchema, pathSchema],
    minItems: 3,
    maxItems: 3,
  };

  const fun = (state, playerPath, path) => {
    return [character.equipped(state.getIn(["characters", ...playerPath]), path)];
  };

  return validate(schema, conditionOutputSchema, fun, state, playerPath, path);
};

const carries = (state, playerPath, item) => {
  const schema = {
    type: "array",
    items: [stateSchema, playerPathSchema, stringSchema],
    minItems: 3,
    maxItems: 3,
  };

  const fun = (state, playerPath, item) => {
    const player = state.getIn(["characters", ...playerPath]);
    return [character.carries(player, item)];
  };

  return validate(schema, conditionOutputSchema, fun, state, playerPath, item);
};

const comparators = {
  below: (a, b) => a < b,
  above: (a, b) => a > b,
};

export const conditions = {
  ally,
  hp,
  mp,
  equipped,
  carries,
};
