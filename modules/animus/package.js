import Manager from "./Manager";
import Message from "./Message";
import MessageBus from "./MessageBus";
import FileSystemManager from "./FileSystemManager";

function init(animus = {}) {
    animus[ MessageBus.GetNamespace() ] = new MessageBus(animus);
    animus[ FileSystemManager.GetNamespace() ] = new FileSystemManager(animus);

    return animus;
}

export default {
    Manager,

    Message,
    MessageBus,
    FileSystemManager,

    _: {
        init
    }
};