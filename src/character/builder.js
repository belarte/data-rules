import Immutable from "immutable";

import { spells } from "src/character/spells.js";

export class Builder {
  constructor() {
    this.reset();
  }

  reset() {
    this.character = {
      behavior: "idle",
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

  withBehavior(behavior) {
    this.character.behavior = behavior;
    return this;
  }

  withHP(currentHP, maxHP) {
    this.character.stats.currentHP = currentHP;
    this.character.stats.maxHP = maxHP;
    return this;
  }

  withMP(currentMP, maxMP) {
    this.character.stats.currentMP = currentMP;
    this.character.stats.maxMP = maxMP;
    return this;
  }

  withSpell(name) {
    this.character.equippement.spells[name] = spells[name];
    return this;
  }

  withBag(bag) {
    this.character.bag = bag;
    return this;
  }

  build() {
    const result = Immutable.fromJS(this.character);
    this.reset();
    return result;
  }
}
