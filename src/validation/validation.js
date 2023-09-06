import Ajv from 'ajv';

const isImmutable = arg => typeof arg === 'object' && arg !== null && arg['toJS'] !== undefined;

const unwrap = args => args.map(arg => isImmutable(arg) ? arg.toJS() : arg);

const validator = new Ajv({allErrors: true});

export const validate = (argsSchema, resSchema, fun, ...args) => {
  if (!validator.validate(argsSchema, unwrap(args))) {
    const errors = validator.errorsText(validator.errors);
    throw new Error('Invalid arguments: ' + errors);
  }

  const res = fun(...args);

  if (!validator.validate(resSchema, res)) {
    const errors = validator.errorsText(validator.errors);
    throw new Error('Invalid result: ' + errors);
  }

  return res;
};