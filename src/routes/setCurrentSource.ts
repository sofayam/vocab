
import * as express from "express";
import { setCurrentSource as setModel } from "../model/mongo";

export const setCurrentSource = express.Router();

setCurrentSource.post("/", async (req, res) => {
    // console.log(req.body);
    const resdb = await setModel(req.body.current);
    res.json(resdb);
});
