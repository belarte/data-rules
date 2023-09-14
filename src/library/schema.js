export const stateSchema = {
  type: 'object',
  required: ['characters', 'behaviors'],
  properties: {
    characters: {
      type: 'object',
      properties: {},
    },
    behaviors: {
      type: 'object',
      properties: {},
    },
    additionalInfo: {
      type: 'object',
      required: ['currentPlayer'],
      properties: {
        currentPlayer: { type: 'array', minItems: 2, maxItems: 2, items: { type: 'string' } },
      },
    },
  },
};

export const comparatorSchema = {
  type: 'string',
  enum: ['below', 'above'],
};

export const numberSchema = {
  type: 'number',
};

export const stringSchema = {
  type: 'string',
};

export const booleanSchema = {
  type: 'boolean',
};

export const pathSchema = {
  type: 'array',
  items: stringSchema,
  minItems: 1,
};

export const targetSchema = {
  type: 'string',
  enum: ['self'],
};

