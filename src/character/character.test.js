import { describe, it, expect } from "vitest";

import * as character from "src/character/character.js";
import { Builder } from "src/character/builder.js";
import { spells } from "src/character/spells.js";
import { items } from "src/character/items.js";

const builder = new Builder();

describe("A character's hp", () => {
    it.each([
        [0, 0, 100],
        [0.25, 25, 100],
        [0.5, 50, 100],
        [0.75, 75, 100],
        [1, 100, 100],
    ])("should be %d when hp are %d/%d", (expected, currentHP, maxHP) => {
        const player = builder.withHP(currentHP, maxHP).build();
        expect(character.hp(player)).toBe(expected);
    });
});

describe("A character's mp", () => {
    it.each([[0], [1], [4], [10]])("should be %d when hp are %d/%d", currentMP => {
        const player = builder.withMP(currentMP, 999).build();
        expect(character.mp(player)).toBe(currentMP);
    });
});

describe("A character's bag", () => {
    it.each([
        [["health-potion", 1]],
        [["health-potion", 7]],
        [["health-potion", 1], ["mana-potion", 1]],
    ])("should contain a potion when the player carries %o", (...items) => {
        for (const [item, quantity] of items) {
            builder.withItem(item, quantity);
        }
        const player = builder.build();
        expect(character.carries(player, "health-potion")).toBeTruthy();
    });

    it.each([["health-potion", 0], ["mana-potion", 1]])(
        `should not contain a potion when the player carries %o`,
        (item, quantity) => {
            const player = builder.withItem(item, quantity).build();
            expect(character.carries(player, "health-potion")).toBeFalsy();
        },
    );

    it("should not contain anything when bag is empty", () => {
        const player = builder.build();
        expect(character.carries(player, "health-potion")).toBeFalsy();
    });
});

describe("When a character uses a potion", () => {
    const player = builder
        .withHP(50, 100)
        .withItem("health-potion", 7)
        .build();

    it("should only use one potion", () => {
        const [playerAfter] = character.use(player, "health-potion");
        expect(playerAfter.getIn(["bag", "health-potion", "quantity"])).toBe(6);
    });

    it("should return the effect of the item", () => {
        const [_, effect] = character.use(player, "health-potion");
        expect(effect).toStrictEqual(items["health-potion"]);
    });
});

describe("When checking if a character equips a spell", () => {
    it("should return false if spell is not equipped", () => {
        const player = builder.build();
        const equipped = character.equipped(player, ["spells", "heal"]);
        expect(equipped).toBeFalsy();
    });

    it("should return true if spell is equipped", () => {
        const player = builder.withSpell("heal").build();
        const equipped = character.equipped(player, ["spells", "heal"]);
        expect(equipped).toBeTruthy();
    });
});

describe("When a character casts a spell", () => {
    const player = builder.withHP(70, 99).withSpell("heal").build();
    const [playerAfter, effect] = character.cast(player, "heal");

    it("should decrease his MP when cast once", () => {
        expect(playerAfter.getIn(["stats", "currentMP"])).toBe(6);
    });

    it("should return the effect of the spell", () => {
        expect(effect).toStrictEqual(spells.heal.effect);
    });
});
