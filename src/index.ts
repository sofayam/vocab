import * as bodyParser from "body-parser";
import * as express from "express";

import * as path from "path";

import { port } from "./util/config";

import { contexts } from "./routes/contexts";
import { enter } from "./routes/enter";
import { fetch } from "./routes/fetch";
import { fetchLatest } from "./routes/fetchLatest";
import { find } from "./routes/find";
import { kill } from "./routes/kill";
import { list } from "./routes/list";
import { save } from "./routes/save";
import { saveNewSource } from "./routes/saveNewSource";
import { setCurrentSource } from "./routes/setCurrentSource";
import { sources } from "./routes/sources";

const serverPort = normalizePort(process.env.PORT || port);

const app = express();

// trick to fix CORS issue found at https://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const statpath = path.join(__dirname, "../src/static");
app.use("/static", express.static(statpath));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");

app.use("/enter", enter);
app.use("/save", save);
app.use("/find", find);
app.use("/fetch", fetch);
app.use("/kill", kill);
app.use("/list", list);
app.use("/contexts", contexts);
app.use("/fetchLatest", fetchLatest);
app.use("/sources", sources);
app.use("/saveNewSource", saveNewSource);
app.use("/setCurrentSource", setCurrentSource);

app.get("/", (req, res) => {
    res.redirect("/enter");
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
