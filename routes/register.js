const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

const saltRounds = 10;

router.get('/', function(req, res, next) {
  res.render('register', { title: "Register" });
});

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) reject(err);
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) reject(err);
                resolve(hash)
            })
        })
    });
}

router.post('/', async function(req, res) {
    const { username, email, password } = req.body;

    const query = `INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)`;

    try {
        const passwordHash = await hashPassword(password);

        const [result] = await db.execute(query, [username.toLowerCase(), passwordHash, email]);
        return res.redirect('/login');
    } catch (error) {
        console.error('Error inserting new user:', error);
        res.status(500).send('An error occurred while creating the user');
    }
})

module.exports = router;