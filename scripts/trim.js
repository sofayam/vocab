// remember to "use vocab" before calling this with "load("trim.js")""

db.vocab.find({},{ "word": 1 }).forEach(function(doc) {
    doc.word = doc.word.trim();
    db.vocab.update(
        { "_id": doc._id },
        { "$set": { "word": doc.word } }
    );
 })