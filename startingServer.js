var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore');
var mongoose = require('mongoose')
var html = require('html');

var app = express()
app.use(bodyParser.json());
app.use(express.static('views'));

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');

var Post = mongoose.model('Post', {
    title : String,
    imageURL: String,
    description: String,
    comments: [{actualComment: String, onPost: String}],
    categories: [String],
    upvotes: [String],
    downvotes: [String],
    category: String,
    time: Date
});

Post.collection.createIndex({description: "text" , title: "text"});

app.get('/api/search', function(req,res)
{
  var arr = req.query.categories.split(",");
  Post.find({category: { $in: arr }, $text: { $search: req.query.q }}, function(err, results)
  {
    if(err)
      throw err;
    res.json(results)
  });
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

app.get('/api/comments',function(req,res)
{
  Comment.find(function(err,comments)
  {
    if(err)
      res.send(error);
    res.json(comments);
  })
});
app.get('/api/category/:categoryName', function(req,res)
{
  Post.find({category: req.params.categoryName}, function(err, postsOfCategory)
  {
    if(err)
      throw err;
    res.json(postsOfCategory);
  })
});

app.get('/api/comments/:postId', function(req,res)
{
  Comment.find({onPost: req.params.postId}, function(err, comments)
  {
    if(err)
      res.send(error)
    res.json(comments);
  })
});

app.post('/api/posts/upvote/:postId', function(req,res)
{
  Post.find({_id: req.params.postId}, function(err,post)
  {
    post[0].upvotes.push(req.body.userId);
    post[0].downvotes = _.filter(post[0].downvotes, function(user)
    {
      return req.body.userId != user
    });

    post[0].save(function(error) {
      if (error) {
        throw error;
      }
      res.json([]);
    });
  })
});

app.post('/api/posts/downvote/:postId', function(req,res)
{
  Post.find({_id: req.params.postId}, function(err,post)
  {
    post[0].downvotes.push(req.body.userId);
    post[0].upvotes = _.filter(post[0].upvotes, function(user)
    {
      return req.body.userId != user
    });

    post[0].save(function(error) {
      if (error) {
        throw error;
      }
      res.json([]);
    });
  })
});

app.post('/api/posts/undoUpvote/:postId', function(req,res)
{
  Post.find({_id: req.params.postId}, function(err,post)
  {
    post[0].upvotes = _.filter(post[0].upvotes,function(user)
    {
      return req.body.userId != user
    });

    post[0].save(function(error) {
      if (error) {
        throw error;
      }
      res.json([]);
    });
  })
});

app.post('/api/posts/undoDownvote/:postId', function(req,res)
{
  Post.find({_id: req.params.postId}, function(err,post)
  {
    post[0].downvotes = _.filter(post[0].downvotes,function(user)
    {
      return req.body.userId != user
    });

    post[0].save(function(error) {
      if (error) {
        throw error;
      }
      res.json([]);
    });
  })
});

app.post('/api/addComment/:postId', function(req,res)
{
  Post.find({_id: req.params.postId}, function(err, post) {
        if (err)
            res.send(err);
        post[0].comments.push({actualComment: req.body.actualComment, onPost: req.body.onPost});
        post[0].save(function(err,post)
        {
          if(err)
            res.send(err)
          res.json([]);
        })
    })
});

app.post('/api/posts', function(req, res) {
  currentTime = new Date;
  Post.create({
           title : req.body.title,
           imageURL: req.body.imageURL,
           description: req.body.description,
           comments: [],
           upvotes: [],
           category: req.body.category,
           downvotes: [],
           time: currentTime
       }, function(err, post) {
           if (err)
               res.send(err);
           res.json(post);
       });
});

app.get('/', function(req,res)
{
  res.render('index.html');
});

app.get('/api/posts/:postId',function(req, res)
{
  if((new RegExp("^[0-9a-fA-F]{24}$")).test(req.params.postId) == false)
  {
      res.json(['ERROR']);
      return;
  }
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
