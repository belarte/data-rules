import { makeHeal } from "src/character/effects.js";

export const spells = {
    heal: {
        effect: makeHeal(20),
        cost: 4,
    },
};
