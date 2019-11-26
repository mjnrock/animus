import Sequencer from "./Sequencer";

export default class EventSequencer extends Sequencer {
    constructor(nodes = [], speed = 1000, options = {}) {
        super(nodes, options);

        this.prop("interval", null);
        this.prop("speed", speed);

        this.SetHook("sequence:end", () => {
            console.log(1234564);
            clearInterval(this.prop("interval"));
        });
        this.SetHook("node:run", (target, ...args) => {
            console.log(target.state);

            // return true;
        });
    }
    
    Start(...args) {
        Sequencer.prototype.Start.call(this);

        this.prop("interval", setInterval(() => {
            this.trigger("node:run");
        }, +this.prop("speed")));

        return this;
    }
    // End() {
    //     Sequencer.prototype.End.call(this);
    //     this.trigger("sequence:end");

    //     return this;
    // }
}

//TODO Sequencer can obviously do everything here, make this separate class meaningful with helpers