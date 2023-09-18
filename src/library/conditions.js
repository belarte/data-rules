import * as character from "src/character/character.js";
import { validate } from "src/validation/validation.js";
import {
  stateSchema,
  comparatorSchema,
  numberSchema,
  conditionOutputSchema,
  stringSchema,
  pathSchema,
} from "src/library/schema.js";

const hp = (state, playerPath, comparator, value) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, comparatorSchema, numberSchema],
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
    items: [stateSchema, pathSchema, comparatorSchema, pathSchema],
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
    items: [stateSchema, pathSchema, pathSchema],
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
    items: [stateSchema, pathSchema, stringSchema],
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
  hp,
  mp,
  equipped,
  carries,
};
