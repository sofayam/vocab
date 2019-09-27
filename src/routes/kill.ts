
import * as express from "express";
import { kill as killdb } from "../model/mongo";

export const kill = express.Router();

kill.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await killdb(req.body.id);
    res.json(resdb);
});
