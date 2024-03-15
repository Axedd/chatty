const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET home page
router.get('/', function(req, res, next) {
  res.render('register', { title: "Register" });
});

router.post('/', async function(req, res) {
    const { username, email, password } = req.body;

    const query = `INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)`;

    try {
        const [result] = await db.execute(query, [username, password, email]);
        return res.redirect('/login');
    } catch (error) {
        console.error('Error inserting new user:', error);
        res.status(500).send('An error occurred while creating the user');
    }
})

module.exports = router;