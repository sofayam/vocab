
import * as mongo from "./model/mongo";

const s1: mongo.Source = {
    tag: "foo",
    full: "the story of foo",
    // created: new Date().getTime(),
};

const s2: mongo.Source = {
    tag: "bar",
    full: "the story of bar",
    // created: new Date().getTime(),
};

function testSource() {
    mongo.addSource(s1).then((res1) => {
        mongo.addSource(s2).then((res2) => {
            console.log(res1, res2);
            mongo.getSources().then((sources) => {
                for (const source of sources) {
                    console.log(source.tag);
                }
            });
        });
    });
}

async function primeSources() {
    await mongo.addSource({ tag: "Gnomo", full: "Wilson Rocha: Um Gnomo na Minha Horta" });
    await mongo.addSource({ tag: "Guarani", full: "José de Alencar: O Guarani" });
    await mongo.addSource({ tag: "Esquinas", full: "Ondjaki : Sonhos azuis pelas esquinas" });
}

function prime() {
    primeSources().then(() => {
        console.log("primed the sources");
    });
}

async function setupSightings() {
    const vocab = await mongo.fetchAllVocab();
    for (const entry of vocab) {
        let visits = 3;
        if (!isNaN(visits)) {
            console.log(entry.word, " : ", visits);
        } else {
            visits = 1;
        }
        while (visits > 0) {
            if (entry._id) {
                mongo.addSighting(entry._id, "foo", entry.created);
            }
            visits = visits - 1;
        }

    }
}

async function goHitBaz() {
    const x = await mongo.addSighting("5d466f3239eab242d3789f3c", "foo");
}

function runSetup() {
    setupSightings().then(() => {
        console.log("finished");
    });
}

function hitBaz() {
    goHitBaz().then(() => {
        console.log("finished");
    });
}

hitBaz();
// runSetup();
