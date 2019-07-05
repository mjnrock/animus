import Manager from "./Manager";
import Message from "./Message";
import MessageManager from "./MessageManager";
import FileSystemManager from "./FileSystemManager";

function init(animus = {}) {
    animus[ MessageManager.GetNamespace() ] = new MessageManager(animus);
    animus[ FileSystemManager.GetNamespace() ] = new FileSystemManager(animus);

    return animus;
}

export default {
    Manager,

    Message,
    MessageManager,
    FileSystemManager,

    _: {
        init
    }
};