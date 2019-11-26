class MessageBus {
    constructor() {        
        this._queue = [];
    }

    Receive(message) {
        if(1 === 1) {
            this._queue.push(message);
        }

        return this;
    }

    Dispatch() {
        let length = this._queue.length;

        for(let i = length - 1; i >= 0; i--) {
            let message = this._queue.pop();

            switch(message.handler) {
                // case MessageBus.GetNamespace():
                //     this._animus[ MessageBus.GetNamespace() ].Receive(message);
                //     break;
                case FileSystemManager.GetNamespace():
                    this._animus[ FileSystemManager.GetNamespace() ].Receive(message);
                    break;
                default:
                    break;
            }
        }

        return this;
    }

    static GetNamespace() {
        return "message";
    }
}

export default MessageBus;