import { describe, it, expect } from "vitest";

import { Game } from "src/game.js";
import { Builder } from "src/character/builder.js";

const builder = new Builder();

describe("The game", () => {
  const game = new Game();
  const behaviors = game.state.get().get("behaviors").keySeq().toJS();

  it.each([["idle"], ["drink-potion"], ["heal-self"]])("should load behavior %s", behavior => {
    expect(behaviors).toContain(behavior);
  });
});

describe("A character with idle behavior", () => {
  const game = new Game();
  const character = builder.withBehavior("idle").build();
  game.addCharacter("Blue Team", "Blue", character);

  it("should not modify the game when playing", () => {
    const before = game.state.get();
    game.play("Blue Team", "Blue");
    const after = game.state.get();

    expect(before).toStrictEqual(after);
  });
});

describe("A character with drink-potion behavior", () => {
  const game = new Game();

  it("should not drink a potion when his bag is empty", () => {
    const character = builder.withBehavior("drink-potion").withHP(49, 100).build();

    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(character);
  });

  it("should not drink a potion when his life is high", () => {
    const character = builder
      .withBehavior("drink-potion")
      .withHP(51, 100)
      .withBag({ "health-potion": { potency: 30, quantity: 1 } })
      .build();

    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(character);
  });

  it("should drink a potion when his life is low", () => {
    const character = builder
      .withBehavior("drink-potion")
      .withHP(49, 100)
      .withBag({ "health-potion": { potency: 30, quantity: 1 } })
      .build();

    const expected = builder.withBehavior("drink-potion").withHP(79, 100).build();

    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(expected);
  });
});

describe("A character with heal-self behavior", () => {
  const game = new Game();

  it("should not heal when the spell is not equipped", () => {
    const character = builder.withBehavior("heal-self").build();

    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(character);
  });

  it("should not heal a potion when his life is full", () => {
    const character = builder
      .withBehavior("heal-self")
      .withHP(100, 100)
      .withSpell({ heal: { potency: 20, cost: 4 } })
      .build();
    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(character);
  });

  it("should heal when his life is low", () => {
    const character = builder
      .withBehavior("heal-self")
      .withHP(49, 100)
      .withMP(10, 10)
      .withSpell("heal", { potency: 20, cost: 4 })
      .build();
    const expected = builder
      .withBehavior("heal-self")
      .withHP(69, 100)
      .withMP(6, 10)
      .withSpell("heal", { potency: 20, cost: 4 })
      .build();

    game.addCharacter("Blue Team", "Blue", character);
    game.play("Blue Team", "Blue");

    const after = game.state.get().getIn(["characters", "Blue Team", "Blue"]);
    expect(after).toStrictEqual(expected);
  });
});
