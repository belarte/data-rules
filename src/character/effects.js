export const makeHeal = (value) => (character) => {
    const maxHP = character.getIn(["stats", "maxHP"]);
    return character.updateIn(["stats", "currentHP"], stat => Math.min(stat + value, maxHP));
};
