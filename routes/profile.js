const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel')

router.get('/', async function(req, res, next) {

  try {
    const user_id = req.session.user.userID;

    if (user_id) {
      const username = req.session.user.username;

      const [postResults, fields] = await postModel.getAllUserPosts([user_id]);
      res.render('profile', { title: 'Profile', username: username, posts: postResults});
    } else {
      res.redirect('/login');
    }
  } catch(e) {
    res.redirect('/login');
  }

});

router.get('/posts', async function(req, res, next) {



  try {
    const user_id = req.session.user.userID;
    const username = req.session.user.username;
    const [postResults, fields] = await postModel.getAllUserPosts([user_id])
    const [commentsResults, commentFields] = await postModel.getAllComments([user_id])
    const [results, authorFields] = await postModel.getPostAuthor()
    authorList = {}

    // Identify usernames from user_ids
    for (i = 0; i < results.length; i++) {
      authorList[results[i].user_id] = results[i].username
    }

    if (user_id) {
      res.render('profilePosts', { 
        title: 'Posts', 
        username: username, 
        posts: postResults, 
        comments: commentsResults, 
        authorList: authorList});
    }

  } catch(e) {
    console.log(e)
    res.redirect('/login')
  }
});

module.exports = router;