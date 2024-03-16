const express = require('express');
const router = express.Router();
const db = require('../models/db');
const eventEmitter = require('./eventEmitter');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', async function(req, res) {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';

  try {
      const [[user]] = await db.execute(query, [username]);

      if (user) {

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {

          req.session.user = { userID: user.user_id, username: username };
          return res.redirect('/');
        } else {
          return res.status(401).send('Username or password is incorrect');
        }
      } else {
        return res.status(401).send('Username or password is incorrect');
      }
  } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('An error occurred during the login process');
  }
});

module.exports = router;