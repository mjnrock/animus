import Sequencer from "../Sequencer";

export default class TimeoutSequencer extends Sequencer {
    constructor(nodes = [], speed = 1000, options = {}) {
        super(nodes, options);

        this.prop("interval", null);
        this.prop("speed", speed);
    }

    Start(...args) {
        this.trigger("start");
        this.trigger("next");

        return this;
    }
    End() {
        this.trigger("end");

        return this;
    }
    Next(...args) {
        console.log(this);
        this.prop("interval", setTimeout(() => {
            this.trigger("next", ...args);
            
        }, this.prop("speed")));


        return this;
    }
}

//TODO Sequencer can obviously do everything here, make this separate class meaningful with helpers