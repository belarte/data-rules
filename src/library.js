import * as character from 'src/character/character.js';
import { validate } from 'src/validation/validation.js';

// conditions

const stateSchema = {
  type: 'object',
  required: ['characters', 'behaviors'],
  properties: {
    characters: {
      type: 'object',
      properties: {},
    },
    behaviors: {
      type: 'object',
      properties: {},
    },
    additionalInfo: {
      type: 'object',
      required: ['currentPlayer'],
      properties: {
        currentPlayer: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
      },
    },
  },
};

const comparatorSchema = {
  type: 'string',
  enum: ['below', 'above'],
};

const numberSchema = {
  type: 'number',
};

const stringSchema = {
  type: 'string',
};

const booleanSchema = {
  type: 'boolean',
};

const pathSchema = {
  type: 'array',
  items: stringSchema,
  minItems: 1,
};

export const hp = (state, playerPath, comparator, value) => {
  const schema = {
    type: 'array',
    items: [stateSchema, comparatorSchema, numberSchema],
    minItems: 3, maxItems: 3,
  };

  const fun = (state, comparator, value) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(['characters', ...playerPath]);
    return comparatorFn(character.hp(player), value);
  };

  return validate(schema, booleanSchema, fun, state, comparator, value);
};

export const mp = (state, playerPath, comparator, valuePath) => {
  const schema = {
    type: 'array',
    items: [stateSchema, comparatorSchema, pathSchema],
    minItems: 3, maxItems: 3,
  };

  const fun = (state, comparator, valuePath) => {
    const comparatorFn = comparators[comparator];
    const player = state.getIn(['characters', ...playerPath]);
    const value = player.getIn(['equippement', ...valuePath]);
    return comparatorFn(character.mp(player), value);
  };

  return validate(schema, booleanSchema, fun, state, comparator, valuePath);
};

export const equipped = (state, playerPath, path) => {
  const schema = {
    type: 'array',
    items: [stateSchema, pathSchema],
    minItems: 2, maxItems: 2,
  };

  const fun = (state, path) => {
    return character.equipped(state.getIn(['characters', ...playerPath]), path);
  };

  return validate(schema, booleanSchema, fun, state, path);
};

export const carries = (state, playerPath, item) => {
  const schema = {
    type: 'array',
    items: [stateSchema, stringSchema],
    minItems: 2, maxItems: 2,
  };

  const fun = (state, item) => {
    const player = state.getIn(['characters', ...playerPath]);
    return character.carries(player, item);
  };

  return validate(schema, booleanSchema, fun, state, item);
};

// actions

export const wait = (state) => {
  return state;
};

export const use = (state, playerPath, item) => {
  const schema = {
    type: 'array',
    items: [stateSchema, stringSchema],
    minItems: 2, maxItems: 2,
  };

  const fun = (state, item) => {
    const player = state.getIn(['characters', ...playerPath]);
    const nextPlayer = character.use(player, item);
    return state.setIn(['characters', ...playerPath], nextPlayer);
  };

  return validate(schema, stateSchema, fun, state, item);
};

export const cast = (state, playerPath, spell) => {
  const schema = {
    type: 'array',
    items: [stateSchema, stringSchema],
    minItems: 2, maxItems: 2,
  };

  const fun = (state, spell) => {
    const nextPlayer = character.cast(state.getIn(['characters', ...playerPath]), spell);
    return state.setIn(['characters', ...playerPath], nextPlayer);
  };

  return validate(schema, stateSchema, fun, state, spell);
};

const comparators = {
  'below': (a, b) => a < b,
  'above': (a, b) => a > b,
};
