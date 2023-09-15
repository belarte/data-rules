import { Map } from "immutable";

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
}
