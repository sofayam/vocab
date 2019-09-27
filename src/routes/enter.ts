
import * as express from "express";
import { fetchLast, fetchOne } from "../model/mongo";
import { getCurrentSource, getSources } from "../model/mongo";
import { niceDateString } from "../util/datefn";

export const enter = express.Router();

enter.get("/", async (req, res) => {
    let fields: any = {};
    if (req.query.word) {
        const words = await fetchOne(req.query.word);
        if (words.length > 0) {
            fields = words[0];
        }
    }
    // TODO: Refactor
    const choices = await getSources();
    const current = await getCurrentSource();
    for (const choice of choices) {
        if (current && current.tag && choice.tag) {
            if (choice.tag === current.tag) {
                choice.current = true;
            }
        }
    }
    const nds = niceDateString(fields.created);
    res.render("enter", {word: fields, choices, nds });
});
