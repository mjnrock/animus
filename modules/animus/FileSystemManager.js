import fs from "fs";
import Manager from "./Manager";

class FileSystemManager extends Manager {
    constructor(animus) {
        super(FileSystemManager.GetNamespace(), animus);
    }
    
    LoadFile(path) {
        fs.readFile(path, (err, data) => {
            console.log(data);
        });
    }

    static GetNamespace() {
        return "file";
    }
}

export default FileSystemManager;