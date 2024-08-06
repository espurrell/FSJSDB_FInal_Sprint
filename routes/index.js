const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user });  
});

router.get('/signup', (req, res) => {
    res.render('signup', { user: req.user });
});

router.get('/auth/register', (req, res) => {
    res.render('register');
});

module.exports = router;