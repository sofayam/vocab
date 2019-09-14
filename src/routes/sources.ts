
import * as express from "express";
import { getCurrentSource, getSources } from "../model/mongo";

export const sources = express.Router();

sources.get("/", async (req, res) => {
    const choices = await getSources();
    const current = await getCurrentSource();
    for (const choice of choices) {
        if (choice.tag === current.tag) {
            choice.current = true;
        }
    }

    res.render("sources", {choices});
});
