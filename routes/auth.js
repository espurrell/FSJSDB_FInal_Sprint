const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
const router = express.Router();

// PostgreSQL connection setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DMV', 
    password: 'Keyin2021',
    port: 5432,
});

// MongoDB connection setup
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDb, usersCollection;

async function connectToMongo() {
    await client.connect();
    mongoDb = client.db('dmv'); 
    usersCollection = mongoDb.collection('user_profiles'); 
}

connectToMongo().catch(console.error);

// Passport Local Strategy for authentication
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];
            if (user && await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

//render login page
router.get('/login', (req, res) => {
    res.render('login');
});

//handle login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/search',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into PostgreSQL
        const pgResult = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);
        const userId = pgResult.rows[0].id;

        // Insert user profile into MongoDB
        const userProfile = {
            userId,  // Reference to PostgreSQL user ID
            username,
            profileData: {}  // Additional profile data
        };
        await usersCollection.insertOne(userProfile);

        res.redirect('/login');
    } catch (err) {
        console.error('Error during signup:', err);
        res.redirect('/signup');
    }
});

//handle logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
