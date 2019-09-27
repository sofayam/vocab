
import * as express from "express";
import { getCurrentSource as getSource } from "../model/mongo";

export const getCurrentSource = express.Router();

getCurrentSource.get("/", async (_, res) => {
    const current = await getSource();
    res.json(current);
});
