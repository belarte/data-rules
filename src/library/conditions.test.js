import { describe, it, expect } from "vitest";

import { Builder as CharacterBuilder } from "src/character/builder.js";
import { Builder as StateBuilder } from "src/state/builder.js";
import { conditions } from "src/library/conditions.js";

const builder = new CharacterBuilder();
const stateBuilder = new StateBuilder();

describe("A character with 50/100 hp", () => {
  const player = builder.withHP(50, 100).build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it.each([
    ["above", 0, true],
    ["above", 0.499, true],
    ["below", 0.501, true],
    ["below", 1, true],
    ["below", 0.499, false],
    ["above", 0.5, false],
    ["above", 1, false],
  ])("should have %s %d = %s", (comp, value, expected) => {
    const [hp] = conditions.hp(state, ["Blue Team", "Blue"], comp, value);
    expect(hp).toBe(expected);
  });

  it.each([
    ["player path is empty", [], "above", 0.5],
    ["player path is invalid (length=1)", ["Blue Team"], "above", 0.5],
    ["player path is invalid (length=3)", ["Blue Team", "Blue", "Blue"], "above", 0.5],
    ["player path is invalid (not strings)", [1, 2], "above", 0.5],
    ["comparator does not exist", ["Blue Team", "Blue"], "does-not-exist", 0],
    ["comparator is empty", ["Blue Team", "Blue"], "", 0],
    ["value is below 0", ["Blue Team", "Blue"], "above", -0.001],
    ["value is above 1", ["Blue Team", "Blue"], "below", 1.001],
  ])("should fail validation because %s", (_reason, path, comp, value) => {
    expect(_ => conditions.hp(state, path, comp, value)).toThrow(/invalid argument/i);
  });
});

describe("A character with 6/10 mp", () => {
  const player = builder.withMP(6, 10).withSpell("spell", { cost: 4 }).build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it.each([
    ["above", ["spells", "spell", "cost"], true],
    ["below", ["spells", "spell", "cost"], false],
  ])("should have %s %s = %s", (comp, valuePath, expected) => {
    const [mp] = conditions.mp(state, ["Blue Team", "Blue"], comp, valuePath);
    expect(mp).toBe(expected);
  });

  it.each([
    ["player path is empty", [], "above", ["spells", "spell", "cost"]],
    ["player path is invalid (length=1)", ["Blue Team"], "above", ["spells", "spell", "cost"]],
    [
      "player path is invalid (length=3)",
      ["Blue Team", "Blue", "Blue"],
      "above",
      ["spells", "spell", "cost"],
    ],
    ["player path is invalid (not strings)", [1, 2], "above", ["spells", "spell", "cost"]],
    [
      "comparator does not exist",
      ["Blue Team", "Blue"],
      "does-not-exist",
      ["spells", "spell", "cost"],
    ],
    ["comparator is empty", ["Blue Team", "Blue"], "", ["spells", "spell", "cost"]],
    ["value path is empty", ["Blue Team", "Blue"], "above", []],
    ["value path is invalid (not strings)", ["Blue Team", "Blue"], "above", [1, 2, 3]],
  ])("should fail validation because %s", (_reason, path, comp, valuePath) => {
    expect(_ => conditions.mp(state, path, comp, valuePath)).toThrow(/invalid argument/i);
  });
});

describe("A character with a spell equipped", () => {
  const player = builder.withSpell("spell", { cost: 4 }).build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it.each([
    [["spells", "spell"], true],
    [["spells", "does-not-exist"], false],
  ])("should have %s equipped = %s", (path, expected) => {
    const [equipped] = conditions.equipped(state, ["Blue Team", "Blue"], path);
    expect(equipped).toBe(expected);
  });

  it.each([
    ["player path is empty", [], ["spells", "spell"]],
    ["player path is invalid (length=1)", ["Blue Team"], ["spells", "spell"]],
    ["player path is invalid (length=3)", ["Blue Team", "Blue", "Blue"], ["spells", "spell"]],
    ["player path is invalid (not strings)", [1, 2], ["spells", "spell"]],
    ["path is empty", ["Blue Team", "Blue"], []],
    ["path is invalid (not strings)", ["Blue Team", "Blue"], [1, 2, 3]],
  ])("should fail validation because %s", (_reason, path, valuePath) => {
    expect(_ => conditions.equipped(state, path, valuePath)).toThrow(/invalid argument/i);
  });
});

describe("A character with a health potion in her bag", () => {
  const player = builder.withBag({ "health-potion": { quantity: 1 } }).build();
  const state = stateBuilder.withCharacter("Blue Team", "Blue", player).build();

  it.each([
    ["health-potion", true],
    ["mana-potion", false],
  ])("should have %s in her bag = %s", (item, expected) => {
    const [carries] = conditions.carries(state, ["Blue Team", "Blue"], item);
    expect(carries).toBe(expected);
  });

  it.each([
    ["player path is empty", [], "health-potion"],
    ["player path is invalid (length=1)", ["Blue Team"], "health-potion"],
    ["player path is invalid (length=3)", ["Blue Team", "Blue", "Blue"], "health-potion"],
    ["player path is invalid (not strings)", [1, 2], "health-potion"],
    ["item is empty", ["Blue Team", "Blue"], ""],
    ["item is invalid (not strings)", ["Blue Team", "Blue"], 1],
  ])("should fail validation because %s", (_reason, path, item) => {
    expect(_ => conditions.carries(state, path, item)).toThrow(/invalid argument/i);
  });
});
