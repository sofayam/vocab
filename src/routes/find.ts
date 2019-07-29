
import * as express from "express";
import { findExisting } from "../model/mongo";

export const find = express.Router();

find.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await findExisting(req.body.fragment);
    res.json(resdb);
});
