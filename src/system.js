import { fromJS } from "immutable";

export class SystemState {
    constructor() {
        this.state = fromJS({
            characters: {},
            behaviors: {},
            additionalInfo: {},
        });
    }

    get() {
        return this.state;
    }

    commit(next) {
        this.state = next;
    }
}
