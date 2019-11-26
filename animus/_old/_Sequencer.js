import AAnimus from "../AAnimus";
import Node from "../Node";

export default class Sequencer extends AAnimus {
    constructor(nodes = []) {
        super();

        this.setState({
            index: 0,
            start: Date.now(),
            previous: null
        });
        
        this.on("next", (name, scope, state, ...args) => {
            let node = scope.GetNode(state.index),
                next = node.getNext();
                
            let index = state.index;

            if(index + 1 >= scope.Nodes.length) {
                index = 0;
            } else {
                ++index;
            }

            // console.log(node);
    
            if(typeof next === "number") {
                if(Date.now() >= state.previous + next) {
                    scope.prop("index", index);
                    scope.prop("previous", Date.now());

                    return true;
                }
            } else if(typeof next === "function") {
                if(next(node, node.getState().data, scope, ...args) === true) {
                    scope.prop("index", index);
                    scope.prop("previous", Date.now());

                    return true;
                }
            }

            return false;
        });

        this.setNodes(nodes);
    }

    setNodes(nodes = []) {
        this.Nodes = [];
        for(let i in nodes) {
            let node = nodes[ i ];

            if(node instanceof Node) {
                this.Nodes.push(node);
            } else if(Array.isArray(node)) {
                let [ data, next, state ] = node;

                this.Nodes.push(new Node(data, next, state));
            }
        }

        return this;
    }

    GetActiveNode() {
        return this.Nodes[ this.prop("index") ];
    }
    GetNode(index = 0) {
        return this.Nodes[ index ];
    }
    SetNode(index, node) {
        this.Nodes[ index ] = node;

        return this;
    }
    AddNode(node) {
        this.Nodes.push(node);

        return this;
    }

    Start() {
        this.meta.start = Date.now();
        this.meta.isPlaying = true;

        return this;
    }
    Stop() {
        this.meta.isPlaying = false;

        return this;
    }
    Reset() {
        this.Stop();

        this.meta.index = 0;

        return this;
    }
}