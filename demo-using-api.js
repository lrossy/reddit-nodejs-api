// load the mysql library
var mysql = require('promise-mysql');

// create a connection to our Cloud9 server
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root', // CHANGE THIS :)
    password : '123456',
    database: 'reddit',
    connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection);

// We call this function to create a new user to test our API
// The function will return the newly created user's ID in the callback
// myReddit.createUser({
//     username: 'lrossy514',
//     password: 'abc123'
// })
//     .then(newUserId => {
//         // Now that we have a user ID, we can use it to create a new post
//         // Each post should be associated with a user ID
//         console.log('New user created! ID=' + newUserId);
//
//         return myReddit.createPost({
//             title: 'Hello Reddit! This is my first post',
//             url: 'http://www.digg.com',
//             userId: newUserId
//         });
//     })
//     .then(newPostId => {
//         // If we reach that part of the code, then we have a new post. We can print the ID
//         console.log('New post created! ID=' + newPostId);
//     })
//     .catch(error => {
//         console.log(error.stack);
//     });

// myReddit.getAllPosts()
//   .then( result => console.log('result: ', result))
//   .catch(error => {
//     console.error('oh shit, error: ', error.stack);
//   });

// myReddit.createSubreddit({name: "kotk", description: "blah blah"})
//   .then( result => console.log('result: ', result))
//   .catch(error => {
//     console.error('oh shit, error: ', error.stack);
//   });

//
// myReddit.getAllSubreddits()
//   .then( result => console.log('result: ', result))
//   .catch(error => {
//     console.error('oh shit, error: ', error.stack);
//   });

// myReddit.getAllSubreddits()
//   .then( result => console.log('result: ', result))
//   .catch(error => {
//     console.error('oh shit, error: ', error.stack);
//   });
// myReddit.createPost({
//     title: 'Hello Reddit! This is my first post',
//     url: 'http://www.digg.com',
//     userId: 1,
//     subredditId: 2
//   })
//   .then( result => console.log('result: ', result))
//   .catch( e => console.log('Error:', e.code));
//
//
// myReddit.createVote({
//   postId: 1,
//   userId: 1,
//   voteDirection: 1
// }).then( result => console.log('result: ', result))
// .catch( e => console.log('Error:', e));
//
// myReddit.createComment({
//   text: "some  reply to comment",
//   userId: 1,
//   postId: 1,
//   parentId: 3
// })
//   .then( result => console.log('result: ', result))
//   .catch(error => {
//     console.error('oh shit, error: ', error);
//   });
// console.log('myReddit.getCommentsForPost(1, 3)',myReddit.getCommentsForPost(1, 3));
// myReddit.getCommentsForPost(1, 3)
//   .then( result => {
//     console.log('result: ', result[0].replies);
//   })
//   .catch(error => {
//     console.error('oh shit, error: ', error);
//   });

myReddit.getCommentsForPost(1, function(err, response){
  console.log('err', err)
  console.log('response', JSON.stringify(response, undefined, 2))
})