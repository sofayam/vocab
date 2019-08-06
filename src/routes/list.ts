
import * as express from "express";
import { dump } from "../model/mongo";
import { pageSize } from "../util/config";

export const list = express.Router();

list.get("/", async (req, res) => {
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page, 10);
    }
    const {records, total} = await dump(page);
    const lastPage = Math.ceil(total / pageSize);
    res.render("list", { records,
        prevPage: Math.max(1, page - 1),
        nextPage: Math.min(page + 1, lastPage),
        lastPage  });
});
