
import * as express from "express";
import { fetchContexts } from "../model/mongo";

export const contexts = express.Router();

contexts.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await fetchContexts(req.body.fragment);
    res.json(resdb);
});
