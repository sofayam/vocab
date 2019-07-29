
import * as express from "express";
import { fetchOne } from "../model/mongo";

export const fetch = express.Router();

fetch.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await fetchOne(req.body.word);
    res.json(resdb);
});
