export const stateSchema = {
  type: "object",
  required: ["characters", "behaviors"],
  properties: {
    characters: {
      type: "object",
      properties: {},
    },
    behaviors: {
      type: "object",
      properties: {},
    },
    additionalInfo: {
      type: "object",
      required: ["currentPlayer"],
      properties: {
        currentPlayer: { type: "array", minItems: 2, maxItems: 2, items: { type: "string" } },
      },
    },
  },
};

export const comparatorSchema = {
  type: "string",
  enum: ["below", "above"],
};

export const numberSchema = {
  type: "number",
};

export const percentageSchema = {
  type: "number",
  minimum: 0,
  maximum: 1,
};

export const stringSchema = {
  type: "string",
};

export const booleanSchema = {
  type: "boolean",
};

export const pathSchema = {
  type: "array",
  items: stringSchema,
  minItems: 1,
};

export const playerPathSchema = {
  type: "array",
  items: stringSchema,
  minItems: 2,
  maxItems: 2,
};

export const targetSchema = {
  type: "string",
  enum: ["self"],
};

export const conditionOutputSchema = {
  type: "array",
  items: [booleanSchema],
  minItems: 1,
  maxItems: 1,
};
