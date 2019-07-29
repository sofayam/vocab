import * as bodyParser from "body-parser";
import * as express from "express";

import * as path from "path";

import { port } from "./util/config";

import { save } from "./routes/save";
import { search } from "./routes/search";

const serverPort = normalizePort(process.env.PORT || port);

const app = express();

// trick to fix CORS issue found at https://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const statpath = path.join(__dirname, "../src/static");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");

app.use("/save", save);
app.use("/search", search);

app.get("/", (req, res) => {
    res.redirect("/save");
});

// NB you need to use server instead of app to make the socket.io magic work here
app.listen(serverPort, () => {
    console.log("listening on port ", serverPort);
});

function normalizePort(val) {
    const inputPort = parseInt(val, 10);
    if (isNaN(inputPort)) {
        // named pipe
        return val;
    }
    if (inputPort >= 0) {
        // port number
        return inputPort;
    }
    return false;
}
