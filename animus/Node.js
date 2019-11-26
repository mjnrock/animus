import AAnimus from "./AAnimus";

//@data <any>: Content data of the <Node>
//@run <int|fn>: How to determine if <Node> should progress (duration or by fn() === true)
//@state? <obj>: Any other data to put in node
export default class Node extends AAnimus {
    constructor(data, state = {}) {
        super({
            ...state,
            _data: data
        });

        this.load({
            "node:run": () => true,
            "node:persist": () => true,
            "node:complete": () => true,
        });
    }

    getDatum(key) {
        return this.getState()[ "_data" ][ key ];
    }
    setDatum(key, value) {
        let data = this.getState()[ "_data" ];

        data[ key ] = value;

        this.prop("_data", data);

        return this;
    }
    
    getData() {
        return this.prop("_data");
    }
    setData(data) {
        this.prop("_data", data);

        return this;
    }
}