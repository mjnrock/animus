import Main from "./modules/file-loader/Main";

const express = require(`express`);
const next = require(`next`);
const expressWS = require("express-ws");
const { parse } = require('url');

const dev = process.env.NODE_ENV !== `production`;
const app = next({ dev });
const handle = app.getRequestHandler();
const FileSystem = require(`fs`);

//! This all works! :)
// const data = {
//     num: 0,
//     files: []
// };
// const dataTick = () => {
//     data.num += 1;
    
//     // FileSystem.readFile(`./modules/file-loader/test.txt`, (err, d) => {
//     //     if(err) {
//     //         throw err; 
//     //     }

//     //     data.files.push(d.toString());
//     // });

//     console.log(data);
// }

// setInterval(() => {
//     dataTick();
// }, 500);

app
    .prepare()
    .then(() => {        
        const server = express(),
            ws = expressWS(server),
            eApp = ws.app;

        server.get("/file", (req, res) => {        
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.set("Content-Type", "Application/text");
        });

        server.get(`/p/:id`, (req, res) => {
            const actualPage = `/post`;
            const queryParams = { id: req.params.id, time: Date.now() };
            app.render(req, res, actualPage, queryParams);
        });

        server.get("/main", (req, res) => {
            const parsedUrl = parse(req.url, true);
            const { pathname, query } = parsedUrl;

            app.render(req, res, "/main", data);
        });
        
        server.get("/api/validate", (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.set("Content-Type", "Application/json");
            
            res.send(JSON.stringify({
                api_test: Date.now(),
                api_child_test: {
                    child1: Date.now() + (Math.random() * 1000),
                    child2: Date.now() + (Math.random() * 1000),
                    child3: Date.now() + (Math.random() * 1000)
                }
            }));
        });

        server.get(`*`, (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:3000`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });