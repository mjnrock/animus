import AState from "../AState";

//@data <any>: Content data of the <Node>
//@run <int|fn>: How to determine if <Node> should progress (duration or by fn() === true)
//@state? <obj>: Any other data to put in node
export default class Node extends AState {
    constructor(data, run, state = {}) {
        super({
            ...state,
            run,
            data
        });
    }

    getRun() {
        return this.getState().run;
    }

    getDatum(key) {
        return this.getState().data[ key ];
    }
    setDatum(key, value) {
        let data = this.getState().data;

        data[ key ] = value;

        this.prop("data", data);

        return this;
    }
    
    setData(data) {
        this.prop("data", data);

        return this;
    }
}