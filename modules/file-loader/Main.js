import FileSystem from "fs";

class Main {
    constructor() {
        FileSystem.readFile(`./modules/file-loader/test.txt`, (err, data) => {
            if(err) {
                throw err; 
            }
            console.log(data.toString());
        });
    }
}

export default Main;