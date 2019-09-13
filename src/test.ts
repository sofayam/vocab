
import * as mongo from "./model/mongo";

const s1: mongo.Source = {
    id: "foo",
    full: "the story of foo",
    created: new Date().getTime(),
};

const s2: mongo.Source = {
    id: "bar",
    full: "the story of bar",
    created: new Date().getTime(),
};

mongo.addSource(s1).then((res1) => {
    mongo.addSource(s2).then((res2) => {
        console.log(res1, res2);
        mongo.getSources().then((sources) => {
            for (const source of sources) {
                console.log(source.id);
            }
        });
    });
});
