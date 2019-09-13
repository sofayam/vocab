
import * as express from "express";

export const sources = express.Router();

sources.get("/", async (req, res) => {
    res.render("sources");
});
