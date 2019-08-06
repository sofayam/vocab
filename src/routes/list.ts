
import * as express from "express";
import { dump } from "../model/mongo";

export const list = express.Router();

list.get("/", async (req, res) => {
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page, 10);
    }
    const records = await dump(page);
    res.render("list", { records, nextPage: page + 1 });
});
