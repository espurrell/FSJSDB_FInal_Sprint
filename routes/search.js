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
            
            if (vin_number) {
                const vinResults = await mongodb.search({ vin_number }, 'vehicles'); // Assuming 'vehicles' collection
                mongoResults = mongoResults.concat(vinResults);
            }

            if (licence_number) {
                const licenceResults = await mongodb.search({ licence_number }, 'drivers'); // Assuming 'drivers' collection
                mongoResults = mongoResults.concat(licenceResults);
            }

            if (registration_id) {
                const registrationResults = await mongodb.search({ registration_id }, 'registrations'); // Assuming 'registrations' collection
                mongoResults = mongoResults.concat(registrationResults);
            }

            results = results.concat(mongoResults);
        }

        res.render('results', { results });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).send('An error occurred while searching.');
    }
});

module.exports = router;
