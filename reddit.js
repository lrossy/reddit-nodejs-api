var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    createUser(user) {
        /*
        first we have to hash the password. we will learn about hashing next week.
        the goal of hashing is to store a digested version of the password from which
        it is infeasible to recover the original password, but which can still be used
        to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
            .then(hashedPassword => {
                return this.conn.query('INSERT INTO users (username,password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', [user.username, hashedPassword]);
            })
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A user with this username already exists');
                }
                else {
                    throw error;
                }
            });
    }

    createPost(post) {
        if(!post.subredditId){
          return new Error('subredditId property required')
        }
        return this.conn.query(
            `
            INSERT INTO posts (userId, title, url, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())`,
            [post.userId, post.title, post.url]
        )
            .then(result => {
                return result.insertId;
            });
    }

    createSubreddit(subreddit) {
      return this.conn.query(
        `
            INSERT INTO subreddit (name, description, createdAt, updatedAt)
            VALUES (?, ?, NOW(), NOW())`,
        [subreddit.name, subreddit.description]
        )
        .then(result => {
          return result.insertId;
        })
        .catch(error => {
          // Special error handling for duplicate entry
          if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('A subreddit with this name already exists');
          }
          else {
            throw error;
          }
        });
    }

    getAllSubreddits(){
      return this.conn.query(
        `
            SELECT *
            FROM subreddit s
            ORDER BY createdAt DESC
            LIMIT 25`
      )
    }
    getAllPosts() {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
        return this.conn.query(
            `
            SELECT p.id, title, url, userId, p.createdAt, p.updatedAt,
             u.id as user_id, u.username as username, u.createdAt as createdAtUser, u.updatedAt as updatedAtUser,
             s.id as sub_id, s.name as sub_name, s.description as sub_description
            FROM posts p
            JOIN users u ON u.id = p.userId
            JOIN subreddit s ON s.id = p.subredditId
            ORDER BY createdAt DESC
            LIMIT 25`
        ).then(result => {

          return result.map(function (post) {
            return {
              id: post.id,
              title: post.title,
              url: post.url,
              user: {
                username: post.username,
                createdAt: post.createdAtUser,
                updatedAt: post.updatedAtUser
              },
              subreddit: {
                id: post.sub_id,
                name: post.sub_name,
                description: post.sub_description
              },
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
            }
          });
        });
    }
}

module.exports = RedditAPI;