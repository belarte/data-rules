import fs from 'fs';
import { Map } from 'immutable';

import { parse } from './behavior/parser.js';

export class SystemState {
  constructor() {
    this.state = Map({});
  }
   
  get() {
    return this.state;
  }
   
  commit(next) {
    this.state = next;
  }

  loadBehaviors() {
    const file = fs.readFileSync('./resources/behaviors.dsl', 'utf8');
    const behaviors = parse(file);
    this.state = this.state.set('behaviors', behaviors);
  };
};

