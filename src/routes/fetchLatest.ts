
import * as express from "express";
import { fetchLast } from "../model/mongo";

export const fetchLatest = express.Router();

fetchLatest.get("/", async (req, res) => {
    const resdb = await fetchLast();
    res.json(resdb);
});
