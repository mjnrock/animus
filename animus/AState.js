export default class AState {
    constructor(state = {}) {
        this.state = state;
    }

    getState() {
        return this.state;
    }
    setState(state = {}) {
        this.state = state;

        return this;
    }

    hasProp(key) {
        return this.state[ key ] !== void 0;
    }
    prop(key, value) {
        if(value === void 0) {
            return this.state[ key ];
        } else {
            this.state[ key ] = value;
        }

        return this;
    }
}