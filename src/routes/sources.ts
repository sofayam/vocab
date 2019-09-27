
import * as express from "express";
import { getSources } from "../model/mongo";

export const sources = express.Router();

sources.get("/", async (req, res) => {

    const choices = await getSources();

    res.render("sources", { choices });
});
