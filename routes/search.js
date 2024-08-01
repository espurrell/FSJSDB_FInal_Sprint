// routes/search.js

const express = require('express');
const router = express.Router();
const postgres = require('../models/postgres');
const mongodb = require('../models/mongodb');

router.post('/', async (req, res) => {
    const { query, source } = req.body;
    let results = [];

    try {
        if (source === 'postgres' || source === 'both') {
            // Perform search in PostgreSQL
            const pgResults = await postgres.search(query);
            results = results.concat(pgResults);
        }

        if (source === 'mongo' || source === 'both') {
            // Perform search in MongoDB
            const mongoResults = await mongodb.search(query);
            results = results.concat(mongoResults);
        }

        res.render('results', { results });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching.');
    }
});

module.exports = router;
