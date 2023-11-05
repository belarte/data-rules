export const hp = character => {
    const currentHP = character.getIn(["stats", "currentHP"]);
    const maxHP = character.getIn(["stats", "maxHP"]);
    return currentHP / maxHP;
};

export const carries = (character, itemName) => {
    return character.getIn(["bag", itemName, "quantity"]) > 0;
};

export const use = (character, itemName) => {
    const bag = character.get("bag");
    const effect = bag.getIn([itemName, "effect"]);

    const newBag = bag
        .updateIn([itemName, "quantity"], quantity => {
            return quantity - 1;
        })
        .filter(item => item.get("quantity") > 0);

    return [character.set("bag", newBag), effect];
};

export const mp = character => {
    return character.getIn(["stats", "currentMP"]);
};

export const equipped = (character, path) => {
    return character.hasIn(["equippement", ...path]);
};

export const cast = (character, spell) => {
    const cost = character.getIn(["equippement", "spells", spell, "cost"]);
    const effect = character.getIn(["equippement", "spells", spell, "effect"]);
    return [character.updateIn(["stats", "currentMP"], mp => mp - cost), effect];
};
