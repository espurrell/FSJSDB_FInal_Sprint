// models/postgres.js
const { Pool } = require('pg');

// Create a new pool instance with your PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DMV',
  password: 'Keyin2021',
  port: 5432, // Default port for PostgreSQL
});

// Function to query the database
// const query = (text, params) => pool.query(text, params);

async function search(query) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [query]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
}
}
module.exports = {
  search
};
