import Immutable from "immutable";
import { merge } from 'lodash';

export class Builder {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      behaviors: {},
      characters: {},
    };
  }

  withBehavior(name, behavior) {
    this.state.behaviors[name] = behavior;
    return this;
  }

  withCharacter(team, name, character) {
    this.state = merge(this.state, {
      characters: {
        [`${team}`]: {
          [`${name}`]: character,
        },
      },
    });
    return this;
  }

  build() {
    const result = Immutable.fromJS(this.state);
    this.reset();
    return result;
  }
}

