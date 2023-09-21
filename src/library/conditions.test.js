import { describe, it, expect } from "vitest";

import { Builder as CharacterBuilder } from "src/character/builder.js";
import { Builder as StateBuilder } from "src/state/builder.js";
import { conditions } from "src/library/conditions.js";

const builder = new CharacterBuilder();
const stateBuilder = new StateBuilder();

describe("A character with 50/100 hp", () => {
  const player = builder
    .withHP(50, 100)
    .build();

  const state = stateBuilder
    .withCharacter("Blue Team", "Blue", player)
    .build();

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
