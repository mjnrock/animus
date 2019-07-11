import APIModule from "./api/API";
import Animus from "./modules/animus/package";

import Database from "./modules/database/Database";
import Table from "./modules/database/Table";

const express = require(`express`);
const next = require(`next`);
const mssql = require("mssql");
const expressWS = require("express-ws");
const { parse } = require('url');

const dev = process.env.NODE_ENV !== `production`;
const app = next({ dev });
const handle = app.getRequestHandler();

const config = {
	user: "fuzzyknights",
	password: "fuzzyknights",
	server: "localhost",
	database: "FuzzyKnights",
	schema: "ImageDB"
};
let DB = new Database(mssql, config);
let tbl = new Table(DB, "ImageDB", "ReferenceType");

tbl.Select({ where: "ReferenceTypeID=2", callback: (data) => console.log(data) });
tbl.MetaData();

setTimeout(() => console.log(tbl._columns), 7000)

// (async () => {
// 	let t = await DB.Pull("ReferenceType", { where: `ReferenceTypeID = 2` });
	
// 	console.log(await t._context)
// })()

// const TSQLPool = new mssql.ConnectionPool(config)
// 	.connect()
// 	.then(pool => {
// 		console.log(`Connected to: [Server: ${ config.server }, Database: ${ config.database }]`);

// 		return pool;
// 	})
// 	.catch(err => console.log("Database Connection Failed! Bad Config: ", err));
	
// const API = new APIModule(mssql, TSQLPool, config);

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

const game = Animus._.init({});
game.message.Receive(Animus.Message("file", "bob", "cat"));
game.message.Receive(Animus.Message("file", "cat", "cheese"));
game.message.Dispatch();

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

            console.log(Animus);

            app.render(req, res, "/main", Animus);
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
		
		server.get("/api/*", async (req, res) => {
			try {
				res.setHeader("Content-Type", "application/json");
		
				let result = await API.Handle(req, res);
		
				res.json(result);
			} catch (e) {
				res.status(500);
				res.send(e.message);
			}
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