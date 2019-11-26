import Sequencer from "./Sequencer";

export default class EventSequencer extends Sequencer {
    constructor(nodes = [], options = {}) {
        super(nodes, options);
    }
}

//TODO Sequencer can obviously do everything here, make this separate class meaningful with helpers