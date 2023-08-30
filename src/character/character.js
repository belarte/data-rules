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