
import * as express from "express";
import { fetchLast, fetchOne } from "../model/mongo";
import { getCurrentSource, getSources } from "../model/mongo";

export const enter = express.Router();

enter.get("/", async (req, res) => {
    let fields: any = {};
    if (req.query.word) {
        const words = await fetchOne(req.query.word);
        if (words.length > 0) {
            fields = words[0];
        }
    } else {
        const last = await fetchLast();
        if (last) {
            fields.context = last.context;
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
    res.render("enter", {word: fields, choices });
});
