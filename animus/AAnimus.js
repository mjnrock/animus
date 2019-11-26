import AState from "./AState";

export default class AAnimus extends AState {
    constructor(state = {}, events = {}) {
        super(state);

        this.uuid = AAnimus.GenerateUUID();
        this.events = events;
        this.listeners = {};

        if("init" in this.events) {
            this.invoke("init");
        }
    }

    static GenerateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            // eslint-disable-next-line
            var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    listen(name, listener) {
        if(!Array.isArray(this.listeners[ name ])) {
            this.listeners[ name ] = [];
        }

        this.listeners[ name ].push(listener);

        return this;
    }
    //? Removes all listeners for an event
    unlisten(name) {
        delete this.listeners[ name ];

        return this;
    }
    //? Removes the passed @listener from the event
    decouple(name, listener) {
        if(Array.isArray(this.listeners[ name ])) {
            for(let i in this.listeners[ name ]) {
                let list = this.listeners[ name ][ i ];

                if(list.toString() === listener.toString()) {
                    this.listeners[ name ].splice(i, 1);
                }
            }
        }

        return this;
    }

    safeOn(name, handler) {
        if(typeof handler === "function") {
            this.events[ name ] = handler;

            return true;
        }

        return false;
    }

    load(events = {}) {
        for(let name in events) {
            this.events[ name ] = events[ name ];
        }

        return this;
    }

    on(name, handler) {
        this.events[ name ] = handler;

        return this;
    }
    off(name) {
        delete this.events[ name ];

        return this;
    }

    get(name) {
        return this.events[ name ];
    }
    has(name) {
        return !!this.events[ name ];
    }
    trigger(name, ...args) {
        let fn = this.events[ name ];

        if(typeof fn === "function") {
            let result = fn(this, this.getState(), ...args);

            for(let i in this.listeners[ name ]) {
                let listener = this.listeners[ name ][ i ];

                if(typeof listener === "function") {
                    listener(this, result);
                }
            }

            return result;
        }

        return null;
    }

    invoke(name, ...args) {        
        // return this.asynciffe(this.trigger, name, ...args);

        
        let _this = this;

        (async function main () {
            try {
                let result = await _this.trigger(name, ...args);

                return result;
            } catch(err){
                return null;
            }
        })();
    }

    asynciffe(fn, ...args) {        
        return (async function main () {
            try {
                let result = await fn(...args)

                return result;
            } catch(err){
                return null;
            }
        })();
    }
}