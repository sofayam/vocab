
import * as assert from "assert";
import { Collection, MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { pageSize } from "../util/config";

export interface Source {
    id: string;
    full: string;
    created: number;
}
export interface Sighting {
    source: string;
    time: number;
}
export interface Dbentry {
    word: string;
    meaning: string;
    context: string;
    type: string;
    example: string;
    created: Date;
    visits: number;
    sightings?: Sighting[];
}

const dbname = "vocab";
const uri = getURI();

// Collections
const vocab = "vocab";
const sources = "sources";

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
    return new Promise((resolve) => {
        getCollection(vocab).then((cc) => {
            // delete the old ones first
            cc.collection.deleteMany({ word: entry.word }, (err, res) => {
                assert.equal(err, null);
                cc.collection.insertOne(entry, (err1, res1) => {
                    cc.client.close();
                    if (res1) {
                        // console.log("inserted new entry");
                        resolve({ success: true });
                    }
                });
            });
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

export function killMany(word: string) {
    return new Promise((resolve) => {
        getCollection(vocab).then((cc) => {
            // delete the old ones first
            cc.collection.deleteMany({ word }, (err, res) => {
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
            cc.collection.count().then((ct) => {
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

export function bumpIt(id: number) {
    // TODO:
}

export function addSource(source: Source) {
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
