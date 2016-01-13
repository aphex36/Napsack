var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore');
var mongoose = require('mongoose')
var html = require('html');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var app = express()
app.use(bodyParser.json())

app.use(express.static('views'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserInformation.findOne({
      'username': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

var Post = mongoose.model('Post', {
    title : String,
    postId : Number,
    imageURL: String,
    description: String,
});

var UserInformation = mongoose.model('UserInformation',
{
    username: String,
    password: String,
    profilePicURL: String
});

var Comments = mongoose.model('Comments',
{
  byUser: String,
  toUser: String,
  parent: String
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
})

app.get('/api/posts', function(req,res)
{
  Post.find(function(err,posts)
  {
    if(err)
      res.send(error);
    res.json(posts)
  });
});

app.get('/api/comments', function(req,res)
{
  Comments.find(function(err, comments)
  {
    if(err)
      res.send(error)
    res.json(comments);
  })
});

app.post('/api/comments', function(req,res)
{
  Comments.create(
  {
     byUser: req.body.byUser,
     toUser: req.body.toUser,
     parent: req.body.parent,
     onPost: req.body.onPost
  },
  function(err, comment)
  {
    if (err)
        res.send(err);

    Comments.find(function(err, comments) {
        if (err)
            res.send(err)
        res.json(comments);
    });
  })
});

app.delete('/api/allposts', function(req,res)
{
  Post.remove({}, function(err,posts)
  {
    if(err)
      res.send(error);
    res.json(posts)
  });
});


app.get('/api/users', function(req,res)
{
  UserInformation.find(function(err,users)
  {
    if(err)
      res.send(error);
    res.json(users)
  });
});

app.delete('/api/users/:user_id', function(req, res) {
       UserInformation.remove({
           _id : req.params.user_id
       }, function(err, user) {
           if (err)
               res.send(err);

           UserInformation.find(function(err, users) {
               if (err)
                   res.send(err)
               res.json(users);
           });
       });
   });
app.delete('/api/posts/:post_id', function(req, res) {
        Post.remove({
              _id : req.params.post_id
          }, function(err, post) {
              if (err)
                  res.send(err);

              Post.find(function(err, posts) {
                  if (err)
                      res.send(err)
                  res.json(posts);
              });
          });
      });
app.post('/api/posts', function(req, res) {
  Post.create({
           title : req.body.title,
           imageURL: req.body.imageURL,
           description: req.body.description
       }, function(err, post) {
           if (err)
               res.send(err);

           res.json(post);
       });
});
app.post('/api/users', function(req, res) {
  UserInformation.create({
           username : req.body.username,
           profilePicURL: req.body.profilePicURL,
           password: req.body.password
       }, function(err, user) {
           if (err)
               res.send(err);
           res.json(user);
       });
});


app.get('/', function(req,res)
{
  res.render('index.html');
})
app.get('/api/posts/:postId',function(req, res)
{
  Post.find({
    _id: req.params.postId}, function(err, post)
  {
    if(err)
      res.send(err);
    res.json(post);
  })
});

app.listen(3000, function () {
  console.log('Server listening on', 3000)
})
