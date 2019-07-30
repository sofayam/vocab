
import * as express from "express";
import { dump } from "../model/mongo";

export const list = express.Router();

list.get("/", async (req, res) => {
    const records = await dump();
    res.render("list", { records });
});
