import Immutable from 'immutable';

export class Builder {
  constructor() {
    this.reset();
  };

  reset() {
    this.character = {
      stats: {
        currentHP: 100,
        maxHP: 100,
        currentMP: 10,
        maxMP: 10,
      },
      equippement: {
        spells: {},
      },
      bag: {},
    };
  }

  withHP(currentHP, maxHP) {
    this.character.stats.currentHP = currentHP;
    this.character.stats.maxHP = maxHP;
    return this;
  };

  withMP(currentMP, maxMP) {
    this.character.stats.currentMP = currentMP;
    this.character.stats.maxMP = maxMP;
    return this;
  };

  withSpell(name, spell) {
    this.character.equippement.spells[name] = spell;
    return this;
  };

  withBag(bag) {
    this.character.bag = bag;
    return this;
  }

  build() {
    const result = Immutable.fromJS(this.character);
    this.reset();
    return result;
  };
};

export const hp = (character) => {
  const currentHP = character.getIn(['stats', 'currentHP']);
  const maxHP = character.getIn(['stats', 'maxHP']);
  return currentHP / maxHP;
};

export const carries = (character, itemName) => {
  return character.getIn(['bag', itemName, 'quantity']) > 0;
};

export const use = (character, itemName) => {
  const currentHP = character.getIn(['stats', 'currentHP']);
  const maxHP = character.getIn(['stats', 'maxHP']);
  const bag = character.get('bag');
  const potion = bag.get(itemName);
  const potency = potion.get('potency');

  const newHP = Math.min(currentHP + potency, maxHP);
  const newBag = bag.updateIn([itemName, 'quantity'], quantity => {
    return quantity - 1;
  })
  .filter(item => item.get('quantity') > 0);

  return character
    .set('bag', newBag)
    .setIn(['stats', 'currentHP'], newHP);
};

export const mp = (character) => {
  return character.getIn(['stats', 'currentMP']);
}

export const equipped = (character, path) => {
  return character.hasIn(['equippement', ...path]);
}

export const cast = (character, spell) => {
  const potency = character.getIn(['equippement', 'spells', spell, 'potency']);
  const cost = character.getIn(['equippement', 'spells', spell, 'cost']);
  return character
    .updateIn(['stats', 'currentMP'], mp => mp - cost)
    .updateIn(['stats', 'currentHP'], hp => Math.min(hp + potency, 100));
}

