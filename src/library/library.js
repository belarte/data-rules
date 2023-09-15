import * as character from "src/character/character.js";
import { validate } from "src/validation/validation.js";
import {
  stateSchema,
  comparatorSchema,
  numberSchema,
  booleanSchema,
  stringSchema,
  pathSchema,
  targetSchema,
} from "src/library/schema.js";

// conditions

export const hp = (state, playerPath, comparator, value) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, comparatorSchema, numberSchema],
    minItems: 4,
    maxItems: 4,
  };

  const fun = (state, playerPath, comparator, value) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(["characters", ...playerPath]);
    return comparatorFn(character.hp(player), value);
  };

  return validate(schema, booleanSchema, fun, state, playerPath, comparator, value);
};

export const mp = (state, playerPath, comparator, valuePath) => {
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
    return comparatorFn(character.mp(player), value);
  };

  return validate(schema, booleanSchema, fun, state, playerPath, comparator, valuePath);
};

export const equipped = (state, playerPath, path) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, pathSchema],
    minItems: 3,
    maxItems: 3,
  };

  const fun = (state, playerPath, path) => {
    return character.equipped(state.getIn(["characters", ...playerPath]), path);
  };

  return validate(schema, booleanSchema, fun, state, playerPath, path);
};

export const carries = (state, playerPath, item) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, stringSchema],
    minItems: 3,
    maxItems: 3,
  };

  const fun = (state, playerPath, item) => {
    const player = state.getIn(["characters", ...playerPath]);
    return character.carries(player, item);
  };

  return validate(schema, booleanSchema, fun, state, playerPath, item);
};

// actions

export const wait = state => {
  return state;
};

export const use = (state, playerPath, item) => {
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

export const cast = (state, playerPath, spell, target) => {
  const schema = {
    type: "array",
    items: [stateSchema, pathSchema, stringSchema, targetSchema],
    minItems: 4,
    maxItems: 4,
  };

  const fun = (state, playerPath, spell) => {
    const nextPlayer = character.cast(state.getIn(["characters", ...playerPath]), spell);
    return state.setIn(["characters", ...playerPath], nextPlayer);
  };

  return validate(schema, stateSchema, fun, state, playerPath, spell, target);
};

const comparators = {
  below: (a, b) => a < b,
  above: (a, b) => a > b,
};
