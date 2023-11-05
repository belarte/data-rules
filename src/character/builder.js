import Immutable from "immutable";

import { spells } from "src/character/spells.js";
import { items } from "src/character/items.js";

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

    withItem(name, quantity) {
        this.character.bag[name] = {
            quantity,
            potency: 30,
            effect: items[name]
        };
        return this;
    }

    withSpell(name) {
        this.character.equippement.spells[name] = spells[name];
        return this;
    }

    build() {
        const result = Immutable.fromJS(this.character);
        this.reset();
        return result;
    }
}
