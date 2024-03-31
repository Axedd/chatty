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
            await db.query(`DELETE FROM user_likes WHERE post_id = ?`, [post_id], callback)
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
        
    },
    togglePostLike: async (userID, postID) => {
        try {
            await db.query('START TRANSACTION');
    
            // Query to check if the like already exists
            const queryResult = await db.query('SELECT EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND post_id = ?) AS likeExists', [userID, postID]);
            const likeExists = queryResult[0][0].likeExists;
            let state = false;
    
            if (likeExists) {
                // If the like exists, delete it (unlike)
                await db.query('DELETE FROM user_likes WHERE user_id = ? AND post_id = ?', [userID, postID]);
                await db.query('UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = ?', [postID]);
                state = false;
                console.log('Like removed successfully.');
            } else {
                // If the like doesn't exist, insert it
                await db.query('INSERT INTO user_likes (user_id, post_id) VALUES (?, ?)', [userID, postID]);
                await db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postID]);
                state = true;
                console.log('Like added successfully.');
            }
    
            await db.query('COMMIT');
            // Query to get the current like count after the operation
            const likeCountResult = await db.query('SELECT likes FROM posts WHERE id = ?', [postID]);
            console.log(likeCountResult);
            return { likeCount: likeCountResult[0][0].likes, state: state}; // Make sure to access the correct structure of your result set
        } catch(e) {
            await db.query('ROLLBACK');
            console.error('Error toggling post like:', e);
            throw e;
        }
    },
    getUserLikedPosts: async (userID, callback) => {
        try {
            const likedPosts = await db.query(`SELECT * FROM user_likes WHERE user_id = ?`, [userID], callback);
            return likedPosts;
        } catch(e) {
            console.log(e)
        }
    },
    toggleFollower: async (follower_id, followed_id) => {
        console.log("DB CONNECTION")
        try {
            await db.query('START TRANSACTION');

            const queryResult = await db.query('SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND followed_id = ?) AS followsExists', [follower_id, followed_id]);
            const followsExists = queryResult[0][0].followsExists;
            let state = false;

            if (followsExists) {
                await db.query('DELETE FROM followers WHERE follower_id = ? AND followed_id = ?', [follower_id, followed_id]);
                state = false;
                console.log('Unfollowed successfully.');
            } else {
                await db.query('INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)', [follower_id, followed_id]);
                state = true;
                console.log('Followed successfully.');
            }

            await db.query('COMMIT');
            return { state: state };
        } catch(e) {
            await db.query('ROLLBACK');
            console.error('Error toggling follower:', e);
            throw e;
        }
    }
}

module.exports = Post;