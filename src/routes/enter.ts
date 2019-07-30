
import * as express from "express";
import { fetchOne } from "../model/mongo";

export const enter = express.Router();

enter.get("/", async (req, res) => {
    if (req.query.word) {
        const words = await fetchOne(req.query.word);
        if (words.length > 0) {
            res.render("enter", {word: words[0]});
            return;
        }
    }
    res.render("enter");
});
