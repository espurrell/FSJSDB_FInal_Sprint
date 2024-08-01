// search.js

const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection setup
const pgClient = new Client({
    user: 'your_pg_user',
    host: 'localhost',
    database: 'your_pg_database',
    password: 'your_pg_password',
    port: 5432, // default PostgreSQL port
});
pgClient.connect();

// MongoDB connection setup
const mongoUri = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error(err));

router.get('/', (req, res) => {
    res.render('search');
});

router.post('/results', async (req, res) => {
    const query = req.body.query;
    let pgResults = [];
    let mongoResults = [];

    try {
        // PostgreSQL search
        const pgQuery = `SELECT * FROM your_pg_table WHERE your_column ILIKE $1`;
        const pgRes = await pgClient.query(pgQuery, [`%${query}%`]);
        pgResults = pgRes.rows;

        // MongoDB search
        const mongoDb = mongoClient.db('dmv');
        const mongoCollection = mongoDb.collection('drivers');
        mongoResults = await mongoCollection.find({ $text: { $search: query } }).toArray();

        // Render results
        res.render('results', { pgResults, mongoResults });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while searching');
    }
});

module.exports = router;
