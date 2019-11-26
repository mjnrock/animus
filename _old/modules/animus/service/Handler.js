import Subscribable from "./../Subscribable";

class Handler extends Subscribable {
	constructor(handlers = {}, subscriptions = {}) {
		super(subscriptions);

        this._handlers = handlers;
	}
    
    Attach(name, handler) {
        if(Array.isArray(name)) {
            for(let i in name) {
                let handle = name[ i ];

                this._handlers[ handle[0] ] = handle[1];
            }
        } else if(typeof handler === "function") {
            this._handlers[ name ] = handler;
        }

        return this;
    }
    Detach(name) {
        delete this._handlers[ name];

        return this;
    }

    SubscribeTo(...args) {
        for(let i in args) {
            let subscribable = args[i];

            if(subscribable instanceof Subscribable) {
                subscribable.Subscribe(this);
            }
        }
    }
    UnsubscribeTo(...args) {
        for(let i in args) {
            let subscribable = args[i];

            if(subscribable instanceof Subscribable) {
                subscribable.Unsubscribe(this);
            }
        }
    }
    
	// Invoke(type, args = {}) {
	// 	this._subject$.next({
	// 		type: type,
	// 		scope: this,
	// 		data: args
	// 	});

	// 	return this;
    // }
    
	Next(message) {
        if(typeof this._handlers[ message.type ] === "function") {
            this._handlers[ message.type ](message);            
            
            // this.Invoke(Handler.EnumEventType.HANDLE, {
            //     scope: this,
            //     data: message
            // });
        } else {        
            // this.Invoke(Handler.EnumEventType.HANDLE_ERROR, {
            //     scope: this,
            //     data: `Nothing attached to <${ message.type }>`
            // });
        }

		return this;
    }
    
    Serialize() {
        return JSON.stringify(this._handlers);
    }
    Deserialize(json) {
        if(typeof json === "string" || json instanceof String) {
            json = JSON.parse(json);
        }

        this._handlers = json._handlers || {};
        this._subscriptions = json._subscriptions || {};

        return this;
    }

    static Deserialize(json) {
        if(typeof json === "string" || json instanceof String) {
            json = JSON.parse(json);
        }

        return new Handler(json._handlers || {}, json._subscriptions || {});
    }
}

Handler.EnumEventType = Object.freeze({
    HANDLE: "event-handle",
    HANDLE_ERROR: "event-handle-error",
});

export default Handler;