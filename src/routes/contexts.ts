
import * as express from "express";
import { fetchContexts } from "../model/mongo";

export const contexts = express.Router();

contexts.get("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await fetchContexts();
    res.json(resdb);
});
