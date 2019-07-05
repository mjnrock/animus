import uuidv4 from "uuid/v4";

class Manager {
    constructor(key, animus) {
        this._key = key;
        this._uuid = uuidv4();

        this._animus = animus;
        this._handlers = {};
    }

    GetName() {
        return this._key;
    }

    Attach(name, handler) {
        if(Array.isArray(name)) {
            for(let i in name) {
                let handle = name[ i ];

                this._handlers[ handle[0] ] = handle[1];
            }
        } else {
            this._handlers[ name ] = handler;
        }

        return this;
    }
    Detach(name) {
        delete this._handlers[ name ];

        return this;
    }


    Package(type, data) {
        return Message(this.GetName(), type, data);
    }
    Receive(message) {
        console.log(this.GetName(), message);

        if(typeof this._handlers[ message.type ] === "function") {
            this._handlers[ message.type ](message, this._animus);
        }

        return this;
    }

    static GetNamespace() {
        return "animus";
    }
}

export default Manager;