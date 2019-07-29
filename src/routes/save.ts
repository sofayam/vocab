
import * as express from "express";
import { save as savedb } from "../model/mongo";

export const save = express.Router();

save.post("/", async (req, res) => {

    console.log(req.body);
    const resdb = await savedb(req.body);
    res.json(resdb);
});
