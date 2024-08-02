const express = require('express');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017')
    .then(client => {
        const db = client.db('dmv');
        app.locals.mongoDb = db;
    })
    .catch(console.error);


// PostgreSQL setup
const postgresPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dmv',
    password: 'Keyin2021',
    port: 5432,
});

app.locals.postgresPool = postgresPool;

// Session and Passport setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

// Start your server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
