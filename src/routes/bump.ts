
import * as express from "express";
import { bumpIt } from "../model/mongo";

export const bump = express.Router();

bump.post("/", async (req, res) => {
    if (req.body.id && req.body.context) {
        await bumpIt(req.body.id, req.body.context);
    }
    res.json();
});
