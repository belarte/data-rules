import peggy from "peggy";

const grammar = `
start
  = _ rules:rule|.., _| { return Object.assign({}, ...rules); }

rule
  = _ name:identifier _ "{" _ ruleBody:ruleBody _ "}" {
      return {
        [name]: {
          ...ruleBody,
        },
      };
    }

ruleBody
  = _ "when" _ conditions:conditions _ "then" _ action:func {
      return { action, conditions, };
    }
  / action:func {
      return { action, conditions: [], };
    }

conditions
  = conditions:condition|.., _| {
      return [...conditions];
    }

condition
  = func:func ";" { return func; }

func "func"
  = name:identifier _ args:args {
      return { name, args: [...args], };
    }

args
  = args:arg|.., _|  { return [...args] }

arg "argument"
  = chain / identifier / percentages / number

chain "chain"
  = id:identifier "." ids:identifier|.., "."| { return [id, ...ids]; }

identifier "identifier"
  = name:[a-zA-Z\-]+ { return name.join(""); }

percentages "percentages"
  = number:number "%" { return number / 100; }

number "number"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace"
  = [ \\n\\t\\r]*
`;

const parser = peggy.generate(grammar);

export const parse = input => {
  return parser.parse(input);
};
