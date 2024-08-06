// models/user.js
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DMV',
    password: 'Keyin2021',
    port: 5432,
});

// MongoDB connection
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    await client.connect();
    return client.db('dmv').collection('user_profiles');
}

module.exports = {
    pool,
    connectToMongo
};
