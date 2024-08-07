const express = require('express');
const router = express.Router();
const postgres = require('../models/postgres');
const mongodb = require('../models/mongodb');

// Get route to display search page
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
            // Construct a dynamic MongoDB query
            await mongodb.connect();
            let mongoQuery = {};
            if (vin_number) {
                mongoQuery.vin_number = vin_number;
            }
            if (licence_number) {
                mongoQuery.licence_number = licence_number;
            }
            if (registration_id) {
                mongoQuery.registration_id = registration_id;
            }

            // Perform search in MongoDB
            const mongoResults = await mongodb.search(mongoQuery, 'vehicles'); // assuming 'vehicles' collection
            results = results.concat(mongoResults);
        }

        res.render('results', { results });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching.');
    }
});

module.exports = router;
