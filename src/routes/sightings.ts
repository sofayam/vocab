
import * as express from "express";
import { fetchID, getSources } from "../model/mongo";
import { fromNow } from "../util/datefn";

export const sightings = express.Router();

sightings.get("/", async (req, res) => {

    const id = req.query.id as string;
    if (id) {
        const entry = await fetchID(id);
        const results: string[] = [];
        if (entry.sightings) {

            for (const sighting of entry.sightings) {
                const nicetime = fromNow(sighting.time + "");
                const record = `Source: ${sighting.source} - ${nicetime}`;
                results.push(record);
            }
        } else {
            results.push("No sightings :-(");
        }
        res.render("sightings", { results });
    } else {
        res.render("failure", {error: "couldn't find anything with id " + id});
    }
    const choices = await getSources();

    res.render("sources", { choices });
});
