
import * as express from "express";
import { addSource } from "../model/mongo";

export const saveSource = express.Router();

saveSource.post("/", async (req, res) => {

    // console.log(req.body);
    const resdb = await addSource(req.body);
    res.json(resdb);
});
