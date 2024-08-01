// app.js
const express = require('express');
const { connect } = require('./models/mongodb');
const { Pool } = require('./models/postgres');

const app = express();

// Middleware and routes setup here

// Connect to MongoDB
connect().catch(console.error);

// PostgreSQL setup
const pool = new Pool();

// Start your server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const searchRoutes = require('./routes/search');
app.use('/search', searchRoutes);
