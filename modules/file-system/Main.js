import FileSystem from "fs";

export default async function Main(path, isRelative = false) {
    // FileSystem.readFile(`${ __dirname }/modules/file-loader/test.txt`, (err, d) => {
    if(isRelative === true) {
        path = `${ __dirname }/${ path }`;
    }

    FileSystem.readFile(path, (err, d) => {
        if(err) {
            throw err; 
        }

        return d.toString();
    });
};