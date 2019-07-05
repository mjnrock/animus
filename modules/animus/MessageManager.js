import Manager from "./Manager";
import Message from "./Message";

class MessageManager extends Manager {
    constructor(animus) {
        super(MessageManager.GetNamespace(), animus);
        
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

        for(let i = length; i >= 0; i--) {
            let message = this._queue.pop();

            switch(message.handler) {
                case MessageManager.GetNamespace():
                    this._animus[ MessageManager.GetNamespace() ].MessageManager.Receive(message);
                    break;
                case FileSystemManager.GetNamespace():
                    this._animus[ FileSystemManager.GetNamespace() ].FileSystemManager.Receive(message);
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

export default MessageManager;