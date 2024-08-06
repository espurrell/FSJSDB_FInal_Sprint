// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// PostgreSQL connection setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DMV',
    password: 'Keyin2021',
    port: 5432,
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // query postgres database for user
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            // Check if password is correct
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            // User authenticated
            return done(null, user);
        } catch (err) {
            return done(err);
        }}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        // query postgres database for user by ID
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        
        if (!user) {
            return done(null, false);
        }
    
    done(null, user);
} catch (err) {
    done(err);
}
});