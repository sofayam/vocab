
import * as express from "express";
import { fetchID, getSources } from "../model/mongo";
import { fromNow } from "../util/datefn";

export const sightings = express.Router();

sightings.get("/", async (req, res) => {

    const id = req.query.id as string;
    const results: string[] = [];
    if (id) {
        const entry = await fetchID(id);
        if (entry.sightings) {

            for (const sighting of entry.sightings) {
                const nicetime = fromNow(sighting.time + "");
                const record = `Source: ${sighting.source} - ${nicetime}`;
                results.push(record);
            }
        } else {
            results.push("No sightings :-(");
        }
    }
    res.json({results});
});
