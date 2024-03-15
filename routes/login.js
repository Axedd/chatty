const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET home page
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', async function(req, res) {
  const {username, password} = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';

  try {
      const [[result]] = await db.execute(query, [username, password]);

      req.session.user = {id: result.user_id, username: username};
      return res.redirect('/');
  } catch (error) {
      console.error('Error inserting new user:', error);
      res.status(500).send('An error occurred while creating the user');
  }
});

module.exports = router;


