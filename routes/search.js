// routes/search.js

const express = require('express');
const router = express.Router();
const postgres = require('../models/postgres');
const mongodb = require('../models/mongodb');

// get route to display search page
router.get('/', (req, res) => {
    res.render('search');
});

router.post('/', async (req, res) => {
    const { vin_number, licence_number, registration_id, source } = req.body;
    let results = [];

    try {
        if (source === 'postgres' || source === 'both') {
            // Perform search in PostgreSQL
            const pgResults = await postgres.search({ vin_number, licence_number, registration_id });
            results = results.concat(pgResults);
        }

        if (source === 'mongo' || source === 'both') {
            // Perform search in MongoDB
            const mongoResults = await mongodb.search({ vin_number, licence_number, registration_id });
            results = results.concat(mongoResults);
        }

        res.render('results', { results });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching.');
    }
});

module.exports = router;
