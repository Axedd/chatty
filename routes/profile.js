const express = require('express');
const router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  
  res.render('profile', { title: req.session.username });
});


module.exports = router;