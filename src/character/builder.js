import Immutable from 'immutable';

export class Builder {
  constructor() {
    this.reset();
  };

  reset() {
    this.character = {
      behavior: 'idle',
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

