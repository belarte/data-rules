import fs from 'fs';
import { parse } from './rules/parser.js';

export class SystemState {
  constructor() {
    this.state = {};
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
    this.state['behaviors'] = behaviors;
  };
};

