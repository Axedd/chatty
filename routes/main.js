const express = require('express');
const router = express.Router();
const db = require('../models/db');
const postModel = require('../models/postModel')


router.get('/', async function (req, res, next) {

  const messages = req.flash('success');

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
      const [user_likes] = await postModel.getUserLikedPosts(req.session.user.userID)
      res.render('index', {
        title: 'Home',
        user: req.session.user,
        posts: postResults,
        authorList: authorList,
        comments: commentResults,
        user_likes: user_likes,
        message: messages.length > 0 ? messages[0] : ''
      });
    } else {
      res.render('index', {
        title: 'Home',
        posts: postResults,
        authorList: authorList,
        comments: commentResults,
        message: messages.length > 0 ? messages[0] : ''
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

router.post('/like/:postID', async (req, res) => {
  const postID = req.params.postID;
  const user = req.session.user;

  try {
    if (user) {
      const userID = req.session.user.userID;
      const [postResults, fields] = await postModel.getAllPosts();
      for (const post of postResults) {
        if (post['id'] == postID) {
          const amountOfLikes = await postModel.togglePostLike(userID, postID);
          console.log(amountOfLikes)
          res.json({ likes: amountOfLikes.likeCount, state: amountOfLikes.state});
          return;
        }
      }
      
    } else {
      res.json({ redirectTo: '/login' });
    }
  } catch (e) {
    console.error('Error liking post:', e);
    res.status(500).send('An error occurred');
  }
})

router.post('/delete', async (req, res) => {
  const user_id = req.session.user.userID;
  const user_role = req.session.user.role;

  try {
    const post_id = req.body.post_id
    const [postResults, fields] = await postModel.getAllPosts()
    let post = postResults.find(post => post.id == post_id)
    console.log(post)

    if (post && (post.user_id == user_id || user_role == "OWNER")) {
      await postModel.deletePost(post_id)
      res.redirect('/')
    }
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
})

router.post('/deleteComment', async (req, res) => {
  const user_id = req.session.user.userID;
  const user_role = req.session.user.role;

  try {
    const comment_id = req.body.comment_id
    const [commentResults, fields] = await postModel.getAllComments()
    let comment = commentResults.find(comment => comment.id == comment_id)

    if (comment && (comment.user_id == user_id || user_role == "OWNER")) {
      await postModel.deleteComment(comment_id)
      res.redirect('/')
    } else {
      res.redirect('/')
    }
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
})



module.exports = router;