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
    let query = 'SELECT * FROM Vehicle v';
    const values = [];
    
    if (vin_number || licence_number || registration_id) {
      query += ' LEFT JOIN Registration r ON v.vin_number = r.vin_number';
      query += ' LEFT JOIN Driver d ON r.driver_id = d.driver_id WHERE 1=1';
    }

    if (vin_number) {
      query += ` AND v.vin_number = $${values.length + 1}`;
      values.push(vin_number);
    }

    if (licence_number) {
      query += ` AND d.licence_number = $${values.length + 1}`;
      values.push(licence_number);
    }

    if (registration_id) {
      query += ` AND r.registration_id = $${values.length + 1}`;
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
