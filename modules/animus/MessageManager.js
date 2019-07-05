import Manager from "./Manager";
import FileSystemManager from "./FileSystemManager";

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

        for(let i = length - 1; i >= 0; i--) {
            let message = this._queue.pop();

            switch(message.handler) {
                // case MessageManager.GetNamespace():
                //     this._animus[ MessageManager.GetNamespace() ].Receive(message);
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

export default MessageManager;