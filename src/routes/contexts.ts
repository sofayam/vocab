
import * as express from "express";
// import { fetchContexts } from "../model/mongo";

export const contexts = express.Router();

contexts.post("/", async (req, res) => {
    // console.log(req.body);
    throw( Error("BAD!!!!"));
    /*
    const resdb = await fetchContexts(req.body.fragment);
    res.json(resdb);
    */
});
