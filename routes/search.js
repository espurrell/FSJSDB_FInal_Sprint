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
    let mongoResults = []; // Initialize mongoResults

    try {
        if (source === 'postgres' || source === 'both') {
            // Perform search in PostgreSQL
            const pgResults = await postgres.search({ vin_number, licence_number, registration_id });
            results = results.concat(pgResults);
        }

        if (source === 'mongo' || source === 'both') {
            // Construct a dynamic MongoDB query
            await mongodb.connect();
            console.log('Connected to MongoDB.');

            if (vin_number) {
                console.log('Searching for VIN:', vin_number);
                const vinResults = await mongodb.search({ vin_number }, 'Vehicle');
                console.log('MongoDB VIN Results:', vinResults);
                mongoResults = mongoResults.concat(vinResults);
            }

            if (licence_number) {
                console.log('Searching for Licence Number:', licence_number);
                const licenceResults = await mongodb.search({ licence_number }, 'Driver');
                console.log('MongoDB Licence Number Results:', licenceResults);
                mongoResults = mongoResults.concat(licenceResults);
            }

            if (registration_id) {
                console.log('Searching for Registration ID:', registration_id);
                const registrationResults = await mongodb.search({ registration_id }, 'Registration');
                console.log('MongoDB Registration ID Results:', registrationResults);
                mongoResults = mongoResults.concat(registrationResults);
            }

            results = results.concat(mongoResults);
        }

        console.log('Final Search Results:', results);
        res.render('results', { results });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).send('An error occurred while searching.');
    }
});

module.exports = router;
