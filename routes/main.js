const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/', async function(req, res, next) {
  const query = 'SELECT * FROM posts ORDER BY created_at DESC';
  
  try {
    const [results, fields] = await db.execute(query);
    
    res.render('index', { title: 'Home', posts: results, userID: req.session.userID});
  } catch (error) {
    console.error('Failed to fetch posts: ', error);
    res.status(500).send('An error occurred while fetching posts.');
  }
});

// Route to handle form submission and create a new post
router.post('/post', async (req, res) => {
  // Assuming you have user session management to get the user's id
  const userId = req.session.userId; // Replace with your session management logic
  const { content, image_url } = req.body;

  if (!content) {
    res.status(400).send("Post content cannot be empty.");
    return;
  }

  // Insert post into database
  const query = `INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)`;
  
  try {
    await db.execute(query, [7, content, image_url || null]);
    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the post.");
  }
});


module.exports = router;