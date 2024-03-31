const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel')

router.get('/', async function (req, res, next) {

  try {
    const user_id = req.session.user.userID;

    if (user_id) {
      const username = req.session.user.username;
      const role = req.session.user.role;
      console.log(req.session.user)

      const [postResults, fields] = await postModel.getAllUserPosts([user_id]);
      res.render('profile', { title: 'Profile', username: username, posts: postResults, role: role, authorizedProfile: true });
    } else {
      res.redirect('/login');
    }
  } catch (e) {
    res.redirect('/login');
  }

});

router.get('/posts', async function (req, res, next) {
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
        authorList: authorList
      });
    }

  } catch (e) {
    console.log(e)
    res.redirect('/login')
  }
});

router.get('/posts/:username', async function (req, res, next) {
  try {
    const username = req.params.username;

    console.log(username)

    const [results, fields] = await postModel.getPostAuthor()
    authorList = {}
    authorListID = {}

    // Identify usernames from user_ids
    for (i = 0; i < results.length; i++) {
      authorList[results[i].username] = [results[i].user_id, results[i].role]
      authorListID[results[i].user_id] = [results[i].username, results[i].role]
    }

    const [postResults, postFields] = await postModel.getAllUserPosts([authorList[username][0]])
    const [commentsResults, commentFields] = await postModel.getAllComments([authorList[username][0]])
    const [postAuthorResults, authorFields] = await postModel.getPostAuthor()

    // Initialize user_likes with a default empty array
    let user_likes = [];

    // Check if there is a session user
    if (req.session.user) {
      // If yes, attempt to retrieve the user's liked posts
      [user_likes] = await postModel.getUserLikedPosts(req.session.user.userID);
    }

    // Your existing logic to check if the author exists in the authorList and render the page
    if (authorList[username][0]) {
      res.render('profilePosts', {
        title: 'Posts',
        username: username,
        posts: postResults,
        comments: commentsResults,
        authorList: authorList,
        authorListID: authorListID,
        user_likes: user_likes // This will now default to [] if not set earlier
      });
    }

  } catch (e) {
    console.log(e)
    res.redirect('/login')
  }
});


router.get('/:username', async function (req, res, next) {
  try {
    const username = req.params.username;
    await postModel.toggleFollower(7, 9)
    

    const [results, fields] = await postModel.getPostAuthor()
    authorList = {}

    // Identify usernames from user_ids
    for (i = 0; i < results.length; i++) {
      authorList[results[i].username] = [results[i].user_id, results[i].role]
    }
    console.log([authorList[username][0]])
    if ([authorList[username][0]] == req.session.user.userID) {
      authorizedProfile = true;
    } else {
      authorizedProfile = false;
    }

    if (authorList[username]) {
      const [postResults, postFields] = await postModel.getAllUserPosts([authorList[username][0]]);
      res.render('profile', { title: 'Profile', username: username, posts: postResults, role: authorList[username][1], authorizedProfile: authorizedProfile });
    } else {
      res.redirect('/')
    }
  } catch (e) {
    res.redirect('/')
  }
})

module.exports = router;