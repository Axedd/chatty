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
    },
    getAllUserPosts: function(user_id, callback) {
        return db.query(`SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC`, [user_id], callback);
    },
    deletePost: async function(post_id, callback) {
        try {
            await db.query(`DELETE FROM comments WHERE post_id = ?`, [post_id], callback)
            await db.query(`DELETE FROM posts WHERE id = ?`, [post_id], callback)
        } catch(e) {
            await db.query(`DELETE FROM posts WHERE id = ?`, [post_id], callback)
        }
    },
    deleteComment: async function(comment_id, callback) {
        try {
            await db.query(`DELETE FROM comments WHERE id = ?`, [comment_id], callback)
        } catch(e) {
            console.log(e)
        }
    }
}

module.exports = Post;