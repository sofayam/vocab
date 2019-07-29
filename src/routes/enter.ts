
import * as express from "express";

export const enter = express.Router();

enter.get("/", async (req, res) => {
    res.render("enter");
});
