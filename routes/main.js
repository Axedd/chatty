const express = require('express');
const router = express.Router();
const db = require('../models/db');
const postModel = require('../models/postModel')


router.get('/', async function(req, res, next) {

  const [results, fields] = await postModel.getPostAuthor()
  authorList = {}

  // Identify usernames from user_ids
  for (i = 0; i < results.length; i++) {
    authorList[results[i].user_id] = results[i].username
  }
  
  try {
    const [postResults, fields] = await postModel.getAllPosts()
    const [commentResults, commentFields] = await postModel.getAllComments()
    
    if (req.session.user) {
      res.render('index', { title: 'Home', 
      user: req.session.user,
      posts: postResults, 
      authorList: authorList, 
      comments: commentResults
    });
    } else {
      res.render('index', { 
        title: 'Home', 
        posts: postResults, 
        authorList: authorList, 
        comments: commentResults
      });
    }
  } catch (error) {
    console.error('Failed to fetch posts: ', error);
    res.status(500).send('An error occurred while fetching posts.');
  }
});

// Route to handle form submission and create a new post
router.post('/post', async (req, res) => {
  const user_id = req.session.user.userID
  const { content, image_url } = req.body;

  if (!content) {
    res.status(400).send("Post content cannot be empty.");
    return;
  }

  try {
    await postModel.createPost([user_id, content, image_url || null])
    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the post.");
  }
});

router.post('/comment', async (req, res) => {
  const user_id = req.session.user.userID
  const { content, post_id } = req.body;

  if (!content) {
    res.status(400).send("Post content cannot be empty.");
    return;
  }

  try {
    await postModel.createComment([user_id, post_id, content])
    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the post.");
  }
});

router.post('/delete', async (req, res) => {

  try {
    const post_id = req.body.post_id;
    await postModel.deletePost(post_id)
    res.redirect('/')
  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})


module.exports = router;