
dump:

    mongodump -d vocab -o vocab


restore:

    optionally:

        mongo
        use vocab
        db.dropDatabase()

    and then:

        mongorestore -d vocab vocab/vocab