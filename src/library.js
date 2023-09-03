import * as character from 'src/character/character.js';

// conditions

export const hp = (state, playerPath, comparator, value) => {
  const comparatorFn = comparators[comparator];
  const player = state.getIn(['characters', ...playerPath]);
  return comparatorFn(character.hp(player), value);
};

export const mp = (state, playerPath, comparator, valuePath) => {
  const comparatorFn = comparators[comparator];
  const player = state.getIn(['characters', ...playerPath]);
  const value = player.getIn(['equippement', ...valuePath]);
  return comparatorFn(character.mp(player), value);
};

export const equipped = (state, playerPath, path) => {
  const res = character.equipped(state.getIn(['characters', ...playerPath]), path);
  return res;
};

export const carries = (state, playerPath, item) => {
  const player = state.getIn(['characters', ...playerPath]);
  return character.carries(player, item);
};

// actions

export const wait = (state) => {
  return state;
};

export const use = (state, playerPath, item) => {
  const player = state.getIn(['characters', ...playerPath]);
  const nextPlayer = character.use(player, item);
  return state.setIn(['characters', ...playerPath], nextPlayer);
};

export const cast = (state, playerPath, spell) => {
  const nextPlayer = character.cast(state.getIn(['characters', ...playerPath]), spell);
  return state.setIn(['characters', ...playerPath], nextPlayer);
};

const comparators = {
  'below': (a, b) => a < b,
  'above': (a, b) => a > b,
};
