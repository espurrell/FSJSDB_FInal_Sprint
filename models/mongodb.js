// models/mongodb.js
const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017/DMV';
const dbName = 'DMV';

// Create a new MongoClient
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

let db;

// Connect to MongoDB
const connect = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

// Function to get the database instance
const getDb = () => db;

// Function to search the database
async function search(query, collectionName) {
  try {
    if (!db) {
      await connect(); // Ensure the connection is established
    }
    const collection = db.collection(collectionName);
    const result = await collection.find(query).toArray();
    return result;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

module.exports = {
  connect,
  getDb,
  search
};
