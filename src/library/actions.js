import * as character from "src/character/character.js";
import { validate } from "src/validation/validation.js";
import { stateSchema, stringSchema, targetSchema, playerPathSchema } from "src/library/schema.js";

const wait = state => {
    return state;
};

const use = (state, playerPath, item, target) => {
    const schema = {
        type: "array",
        items: [stateSchema, playerPathSchema, stringSchema, stringSchema],
        minItems: 4,
        maxItems: 4,
    };

    const fun = (state, playerPath, item, target) => {
        switch (target) {
            case "self":
                const player = state.getIn(["characters", ...playerPath]);
                const nextPlayer = character.use(player, item);
                return state.setIn(["characters", ...playerPath], nextPlayer);
            default:
                throw new Error(`Unknown target "${target}"`);
        }
    };

    return validate(schema, stateSchema, fun, state, playerPath, item, target);
};

const cast = (state, playerPath, spell, target) => {
    const schema = {
        type: "array",
        items: [stateSchema, playerPathSchema, stringSchema, targetSchema],
        minItems: 4,
        maxItems: 4,
    };

    const fun = (state, playerPath, spell, target) => {
        const [player, effect] = character.cast(state.getIn(["characters", ...playerPath]), spell);

        switch (target) {
            case "self":
                const nextPlayer = effect(player);
                return state.setIn(["characters", ...playerPath], nextPlayer);
            case "ally":
                const target = state.getIn(["additionalInfo", "target"]);
                const ally = state.getIn(["characters", ...target]);
                const nextAlly = effect(ally);
                return state
                    .setIn(["characters", ...playerPath], player)
                    .setIn(["characters", ...target], nextAlly);
            default:
                throw new Error(`Unknown target "${target}"`);
        }
    };

    return validate(schema, stateSchema, fun, state, playerPath, spell, target);
};

export const actions = {
    wait,
    use,
    cast,
};
