
import * as express from "express";

export const search = express.Router();

search.get("/", async (req, res) => {
    res.render("search");
});
