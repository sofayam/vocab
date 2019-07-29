
import * as assert from "assert";
import { Collection, MongoClient, MongoClientOptions, ObjectId } from "mongodb";

export interface Dbentry {
    word: string;
    meaning: string;
    context: string;
    type: string;
    example: string;
}

const dbname = "vocab";
const uri = getURI();

// Collections
const vocab = "vocab";

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
                        console.log("inserted new entry");
                        resolve({success: true});
                    }
                });
            });
        });
    });

}

export function load(word: string) {
    return new Promise<Dbentry>((resolve, reject) => {
        getCollection(vocab).then((cc) => {
            cc.collection.findOne({ word }, (err, res) => {
                cc.client.close();
                assert.equal(err, null);
                if (res) {
                    resolve(res);
                } else {
                    resolve(undefined);
                }
            });
        });
    });
}

export function findExisting(fragment: string) {
    return new Promise<any>((resolve) => {
        getCollection(vocab).then((cc) => {
            const selector = new RegExp("^" + fragment, "i");
            cc.collection.find({word: selector}).toArray((err, res) => {
                if (err) {
                    throw(Error(`Error: {err}`));
                }
                resolve(res);
            });
            cc.client.close();
        });
    });
}
