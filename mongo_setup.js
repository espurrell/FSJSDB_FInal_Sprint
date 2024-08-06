// mongo_setup.js

// Connect to the MongoDB database
const { MongoClient } = require('mongodb');

async function main() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db('dmv');

        // Create collections
        await db.createCollection('drivers');
        await db.createCollection('vehicles');
        await db.createCollection('registrations');
        await db.createCollection('users');

        console.log('Collections created successfully');
    } finally {
        await client.close();
    }
}

main().catch(console.error);
