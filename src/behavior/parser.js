import peggy from 'peggy';

const grammar = `
start
  = _ name:identifier _ "{" _ rule:rule _ "}" {
      return {
        [name]: {
          ...rule,
        },
      };
    }

rule
  = _ "when" _ conditions:conditions _ "then" _ action:action {
      return { action, conditions, };
    }
  / action:action {
      return { action, conditions: [], };
    }

conditions
  = conditions:condition|.., _| {
      return [...conditions];
    }
  / _ condition:condition {
      return [condition];
    }

condition
  = name:identifier _ args:args ";" {
      return { name, args: [...args], };
    }

args
  = args:arg|.., _|  { return [...args] }

arg "argument"
  = identifier / percentages / number

action "action"
  = name:identifier _ args:args {
      return { name, args: [...args], };
    }

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

export const parse = (input) => {
  return parser.parse(input);
};
