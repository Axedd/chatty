const db = require('db.js')

const Post = {
    getAllPosts: function(callback) {
        return db.query('SELECT * FROM posts ORDER BY created_at DESC', callback);
    },
    createPost: function(post, callback) {
        return db.query('INSERT INTO posts SET ?', post, callback);
    }
}

module.exports = Post;