const db = require('./db')

const Post = {
    getAllPosts: function(callback) {
        return db.query('SELECT * FROM posts ORDER BY created_at DESC', callback);
    },
    createPost: function([user_id, content, image_url], callback) {
        return db.query('INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)', [user_id, content, image_url], callback);
    },
    getPostAuthor: function(callback) {
        return db.query(`SELECT * FROM users WHERE user_id`, callback)
    },
    createComment: function([user_id, post_id, content], callback) {
        return db.query('INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)', [user_id, post_id, content], callback)
    },
    getAllComments: function(callback) {
        return db.query('SELECT * FROM comments', callback)
    }
}

module.exports = Post;