
import * as assert from "assert";
import { Collection, MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { pageSize } from "../util/config";

export interface Source {
    tag: string;
    full: string;
    created?: number;
    current?: boolean;
}

export interface Choice {
    tag: string;
    created: number;
}
export interface Sighting {
    source: string;
    time: number;
}
export interface Dbentry {
    _id?: string;
    word: string;
    meaning: string;
    type: string;
    example: string;
    created: number;
    sightings?: Sighting[];
}

const dbname = "vocab";
const uri = getURI();

// Collections
const vocab = "vocab";
const sources = "sources";
const current = "current";

function getURI() {

    return "mongodb://localhost:27017";

}

export interface CollClient {
    collection: Collection<any>;
    client: MongoClient;
}

function getCollection(collName: string) {
    return new Promise<CollClient>((resolve) => {
        MongoClient.connect(uri, { useNewUrlParser: true }, (cerr, client) => {
            assert.equal(null, cerr);
            const db = client.db(dbname);
            const collection = db.collection(collName);
            resolve({ collection, client });
        });
    });
}

export function save(entry: Dbentry) {
    return new Promise((resolve, reject) => {
        getCollection(vocab).then((cc) => {
            if (entry._id) {
                // update existing
                cc.collection.updateOne(
                    { _id: new ObjectId(entry._id) },
                    {
                        word: entry.word,
                        meaning: entry.meaning,
                        example: entry.example,
                        type: entry.type,
                        // the other fields are still there from before
                    },
                    (err, _) => {
                        cc.client.close();
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    },
                );
            } else {
                // create new record
                const stamp = new Date().getTime();
                getCurrentSource().then((choice) => {
                    const newEntry: Dbentry = {
                        word: entry.word,
                        meaning: entry.meaning,
                        example: entry.example,
                        type: entry.type,
                        created: stamp,
                        sightings: [{ source: choice.tag, time: stamp }],
                    };
                    cc.collection.insertOne(newEntry, (err, _) => {
                        cc.client.close();
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ success: true });
                        }
                    });
                });
            }
        });
    });
}

export function findExisting(fragment: string) {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            const selector = new RegExp("^" + fragment, "i");
            cc.collection.find({ word: selector }).toArray((err, res) => {
                if (err) {
                    throw (Error(`Error: ${err}`));
                }
                resolve(res);
                cc.client.close();
            });
        });
    });
}

export function fetchOne(word: string) {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            cc.collection.find({ word }).toArray((err, res) => {
                if (err) {
                    throw (Error(`Error: ${err}`));
                }
                resolve(res);
                cc.client.close();
            });
        });
    });
}

export function kill(id: string) {
    return new Promise((resolve) => {
        getCollection(vocab).then((cc) => {
            // delete the old ones first
            cc.collection.deleteOne({ _id: new ObjectId(id) }, (err, res) => {
                assert.equal(err, null);
                cc.client.close();
                resolve({ success: true });
            });
        });
    });
}

export function dump(page) {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            const options = {
                skip: (page - 1) * pageSize,
                limit: pageSize,
            };
            cc.collection.countDocuments().then((ct) => {
                cc.collection.find({}, options).sort({ $natural: -1 }).toArray((err, res) => {
                    if (err) {
                        throw (Error(`Error: ${err}`));
                    }
                    resolve({ records: res, total: ct });
                    cc.client.close();
                });
            });
        });
    });
}

export function fetchContexts(fragment) {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            cc.collection.distinct("context", {}, (err, res) => {
                if (err) {
                    throw (Error(`Error: ${err}`));
                }
                const filtered: string[] = [];
                const re = new RegExp(`${fragment}`, "i");
                for (const ctx of res) {
                    if (re.test(ctx)) {
                        filtered.push(ctx);
                    }
                }
                resolve(filtered);
                cc.client.close();
            });
        });
    });
}

export function fetchLast() {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            cc.collection.find().limit(1).sort({ $natural: -1 }).toArray((err, res) => {
                if (res.length > 0) {
                    resolve(res[0]);
                } else {
                    resolve();
                }
                cc.client.close();
            });

        });
    });
}

export async function bumpIt(id: string, context: string) {
    await addSighting(id, context);
}

export function addSource(source: Source) {
    source.created = new Date().getTime();
    return new Promise<boolean>((resolve) => {
        getCollection(sources).then((cc) => {
            cc.collection.insertOne(source, (err, res) => {
                cc.client.close();
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    });
}

export function getSources() {
    return new Promise<Source[]>((resolve) => {
        getCollection(sources).then((cc) => {
            cc.collection.find({}).toArray((err, res) => {
                if (err) {
                    throw (Error(`Error: ${err}`));
                }
                resolve(res as Source[]);
                cc.client.close();
            });
        });
    });
}

export function getCurrentSource() {
    return new Promise<Choice>((resolve) => {
        getCollection(current).then((cc) => {
            cc.collection.findOne({}, { sort: { $natural: -1 } }).then((res) => {
                resolve(res);
                cc.client.close();
            });
        });
    });
}

export function setCurrentSource(chosen: string) {
    return new Promise<any>((resolve) => {
        const choice: Choice = {
            tag: chosen,
            created: new Date().getTime(),
        };
        getCollection(current).then((cc) => {
            cc.collection.insertOne(choice).then((res) => {
                resolve({});
                cc.client.close();
            });
        });
    });
}

export function addSighting(id: string, tag: string, time?: number) {
    if (!time) {
        time = new Date().getTime();
    }
    const sighting: Sighting = {
        source: tag,
        time,
    };
    return new Promise<Sighting>((resolve) => {
        getCollection(vocab).then((cc) => {
            cc.collection.updateOne(
                { _id: new ObjectId(id) },
                { $push: { sightings: sighting } }).then((res) => {
                    resolve(sighting);
                });
        });
    });
}

export function fetchAllVocab() {
    return new Promise<Dbentry[]>((resolve) => {
        getCollection(vocab).then((cc) => {
            cc.collection.find().toArray((err, res) => {
                resolve(res);
            });
        });
    });
}
