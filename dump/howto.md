
dump:

    mongodump -d vocab -o vocab


restore:

    optionally:

        mongodb
        use vocab
        db.dropDatabase()

    and then:

        mongorestore -d vocab vocab/vocab