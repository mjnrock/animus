import AAnimus from "../AAnimus";
import Node from "../Node";

export default class Sequencer extends AAnimus {
    constructor(nodes = [], options = {}) {
        super();

        this.setState({
            index: 0,
            start: null,
            end: null,
            repeat: typeof options.repeat === "boolean" ? options.repeat : false,
            hooks: {}
        });

        this.Nodes = [];
        this.setNodes(nodes);
        
        this.on("sequence:start", (...args) => {
            this.prop("index", 0);
            this.prop("start", Date.now());
            this.prop("end", null);

            let hook = this.prop("hooks")[ "sequence:start" ];

            if(typeof hook === "function") {
                hook(this, ...args);
            }
        });
        this.on("sequence:next", (...args) => {
            let index = this.prop("index"),
                hook = this.prop("hooks")[ "sequence:next" ];

            if(typeof hook === "function") {
                hook(this, ...args);
            }

            console.log(this.prop("repeat"));

            if(index < this.Size(true)) {
                index += 1;
            } else {
                if(this.prop("repeat") === true) {
                    this.trigger("sequence:start");
                } else {
                    this.trigger("sequence:end");
                }
            }
            

            this.prop("index", index);
        });
        this.on("sequence:end", (...args) => {
            this.prop("end", Date.now());

            let hook = this.prop("hooks")[ "sequence:end" ];

            if(typeof hook === "function") {
                hook(this, ...args);
            }
        });


        this.on("node:run", (...args) => {
            let hook = this.prop("hooks")[ "node:run" ];

            if(this.prop("end") === null) {
                if(typeof hook === "function") {
                    let result = hook(this, ...args);
    
                    if(result === false) {
                        this.trigger("node:persist");
                    } else {
                        this.trigger("node:complete");
                    }
                } else {
                    this.trigger("node:complete");
                }
            } else {
                console.info("[Operation Aborted]: Sequence has ended");
            }
        });
        this.on("node:persist", (...args) => {
            let hook = this.prop("hooks")[ "node:persist" ];

            if(typeof hook === "function") {
                hook(this, ...args);
            }
        });
        this.on("node:complete", (...args) => {
            let hook = this.prop("hooks")[ "node:complete" ];

            if(typeof hook === "function") {
                hook(this, ...args);
            }
        });
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

    Size(zeroIndexed = false) {
        if(zeroIndexed) {
            return this.Nodes.length - 1;
        }

        return this.Nodes.length;
    }

    GetHooks() {
        return this.prop("hooks");
    }
    SetHooks(hooks = {}) {
        this.prop("hooks", hooks);

        return this;
    }

    GetHook(key) {
        return this.prop("hooks")[ key ];
    }
    SetHook(key, fn) {
        let hooks = this.prop("hooks");

        hooks[ key ] = fn;
        this.SetHooks(hooks);

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

    SetRepeat(bool = false) {
        this.prop("repeat", !!bool);

        return this;
    }
    ToggleRepeat() {
        this.prop("repeat", !!!this.prop("repeat"));

        return this;
    }

    Start() {
        this.trigger("start");

        return this;
    }
    End() {
        this.trigger("end");

        return this;
    }
}