const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET home page
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', function(req, res) {
  const username = req.body.username;
  const password = req.body.password; // Remember, this should be hashed and checked against a hashed password in the DB.
  
  // Corrected query without 'USE my_db;'
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (error, results, fields) => {
    if (error) {
      console.error(error); // Log the error for debugging.
      return res.sendStatus(500); // Send a generic server error response.
    }
    if (results.length > 0) {
      // TODO: Add password checking logic here.
      req.session.userId = results[0].user_id;
      req.session.username = username;
      return res.send('Logged in successfully');
    } else {
      // No user found with that username
      return res.send('Login failed');
    }
  });
});

module.exports = router;