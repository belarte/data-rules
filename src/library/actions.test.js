import { describe, it, expect } from "vitest";

import { Builder as CharacterBuilder } from "src/character/builder.js";
import { Builder as StateBuilder } from "src/state/builder.js";
import { actions } from "./actions.js";
import { heal } from "src/character/spells.js";

const builder = new CharacterBuilder();
const stateBuilder = new StateBuilder();

describe("The wait action", () => {
  const player = builder.build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it("should do nothing", () => {
    const nextState = actions.wait(state);
    expect(nextState).toBe(state);
  });
});

describe("A charater with an item", () => {
  const player = builder
    .withHP(50, 100)
    .withBag({ item: { potency: 30, quantity: 1 } })
    .build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it("should be able to use it", () => {
    const expectedPlayer = builder.withHP(80, 100).build();
    const expectedState = stateBuilder.withCharacter("Blue Team", "Blue", expectedPlayer).build();

    const nextState = actions.use(state, ["Blue Team", "Blue"], "item");
    expect(nextState).toStrictEqual(expectedState);
  });

  it.each([
    ["player path is empty", [], "item"],
    ["player path is invalid (length=1)", ["Blue Team"], "item"],
    ["player path is invalid (length=3)", ["Blue Team", "Blue", "Blue"], "item"],
    ["player path is invalid (not strings)", [1, 2], "item"],
  ])("should fail validation because %s", (_reason, path, item) => {
    expect(_ => actions.use(state, path, item)).toThrow(/invalid argument/i);
  });
});

describe("A character with a spell equipped", () => {
  const player = builder.withHP(50, 100).withMP(6, 10).withSpell("spell", heal).build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it("should be able to cast it on herself", () => {
    const expectedPlayer = builder.withHP(70, 100).withMP(2, 10).withSpell("spell", heal).build();
    const expectedState = stateBuilder.withCharacter("Blue Team", "Blue", expectedPlayer).build();

    const nextState = actions.cast(state, ["Blue Team", "Blue"], "spell", "self");
    expect(nextState).toStrictEqual(expectedState);
  });

  it.each([
    ["player path is empty", [], "spell", "self"],
    ["player path is invalid (length=1)", ["Blue Team"], "spell", "self"],
    ["player path is invalid (length=3)", ["Blue Team", "Blue", "Blue"], "spell", "self"],
    ["player path is invalid (not strings)", [1, 2], "spell", "self"],
    ["spell is empty", ["Blue Team", "Blue"], "", "self"],
    ["target does not exist", ["Blue Team", "Blue"], "spell", "does-not-exist"],
    ["target is empty", ["Blue Team", "Blue"], "spell", ""],
  ])("should fail validation because %s", (_reason, path, spell, target) => {
    expect(_ => actions.cast(state, path, spell, target)).toThrow(/invalid argument/i);
  });
});
