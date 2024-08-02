// app.js
const express = require('express');
const { connect } = require('./models/mongodb');
const { Pool } = require('./models/postgres');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const passport = require('passport');


const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware and routes setup here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const { MongoClient } = require('mongodb');
const mongoClient = new MongoClient('mongodb://localhost:27017');
let mongoDb;

mongoClient.connect().then(client => {
  mongoDb = client.db('dmv');
  console.log('Connected to MongoDB');
}).catch(console.error);

// PostgreSQL setup
const postgresPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dmv',
  password: 'Keyin2021', 
  port: 5432,
});

//make connections available thoughout the app
app.locals.mongoDb = mongoDb;
app.locals.postgresPool = postgresPool;

//Session and Passport middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/', indexRoutes);

// Start your server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;