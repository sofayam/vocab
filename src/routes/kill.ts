
import * as express from "express";
import { killMany } from "../model/mongo";

export const kill = express.Router();

kill.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await killMany(req.body.word);
    res.json(resdb);
});
