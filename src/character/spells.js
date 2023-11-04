export const heal = {
    effect: (character) => {
        const maxHP = character.getIn(["stats", "maxHP"]);
        return character.updateIn(["stats", "currentHP"], stat => Math.min(stat + 20, maxHP));
    },
    cost: 4,
};
