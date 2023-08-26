import peggy from 'peggy';

const grammar = `
start
  = name:identifier _ "{" _ action:action _ "}" {
      return {
        [name]: {
          action,
          conditions: [],
        },
      };
    }

action "action"
  = name:identifier {
      return {
        name,
        args: [],
      };
    }

identifier "identifier"
  = name:[a-z]+ { return name.join(""); }

_ "whitespace"
  = [ \\n\\t\\r]*
`;

const parser = peggy.generate(grammar);

export const parse = (input) => {
  return parser.parse(input);
};
