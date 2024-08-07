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

async function search({ vin_number, licence_number, registration_id }) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM Vehicle WHERE 1=1'; // Adjust the table name accordingly
    const values = [];

    if (vin_number) {
      query += ` AND vin_number = $${values.length + 1}`;
      values.push(vin_number);
    }
    if (licence_number) {
      query += ` AND licence_number = $${values.length + 1}`;
      values.push(licence_number);
    }
    if (registration_id) {
      query += ` AND registration_id = $${values.length + 1}`;
      values.push(registration_id);
    }

    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  search
};
