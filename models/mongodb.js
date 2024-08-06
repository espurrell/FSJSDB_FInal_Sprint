// models/mongodb.js
const { MongoClient } = require('mongodb');

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017';
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
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

// Function to get the database instance
const getDb = () => db;

async function search(quary) {
  try {
    const db = client.db('dmv');
    const collection = db.collection('users');
    //  *******************************^^^^^ (user_profiles)
    const result = await collection.find({ your_field: {$regex: query, $options: 'i'} }).toArray();
    return result;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
}
}
module.exports = {
  connect,
  getDb,
};
