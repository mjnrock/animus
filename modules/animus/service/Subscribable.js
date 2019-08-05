class Subscribable {
    constructor(subscriptions = {}) {
        this._subscriptions = Object.freeze(subscriptions);
    }

    _setSubscriptions(subscriptions) {
        this._subscriptions = Object.freeze(subscriptions);
    }

    Subscribe(subscriber) {
        let subscriptions = this._subscriptions;

        if(subscriber && subscriber._uuid) {
            subscriptions[ subscriber._uuid ] = subscriber;

            this._setSubscriptions(subscriptions);
        }

        return this;
    }
    Unsubscribe(unsubscriber) {
        let subscriptions = this._subscriptions;

        if(unsubscriber && unsubscriber._uuid) {
            delete subscriptions[ unsubscriber._uuid ];

            this._setSubscriptions(subscriptions);
        }

        return this;
    }

    Next(message) {
        return this;
    }
}

export default Subscribable;