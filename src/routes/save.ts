
import * as express from "express";

export const save = express.Router();

save.get("/", async (req, res) => {
    res.render("save");
});
