const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var Post = db.Post;
var User = db.User;
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());


function myAuthenticator(req, res, next){
  if(req.isAuthenticated()){
    console.log("YES!!!!");
    next();
  } else {
    console.log("Nope!");
    res.redirect('/gallery/login');
  }
}

function isLoggedIn(req){
  if(req.user){
    console.log(req.user.user);
    return true;
  } else {
    return false;
  }
}

router.get('/logout', (req, res) => {
  console.log("Logged out");
  req.logout();
  res.redirect(303, '/gallery');
});

router.get('/', (req, res) => {
  if(isLoggedIn(req)){
    Post.findAll({order: "id"})
    .then(function (images) {
      res.render('index', {images: images, username: req.user.user});
    });
  } else {
    Post.findAll({order: "id"})
    .then(function (images) {
    res.render('index', {images: images});
    });
  }
});

router.get('/new', myAuthenticator, (req, res) => {
  res.render('form', {username: req.user.user});
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/create_user', (req, res) => {
  res.render('create_user');
});

router.get('/secret', myAuthenticator, (req, res) => {
  res.render('secret');
});

router.post('/login', passport.authenticate('local', 
  { 
    successRedirect: '/gallery/',
    failureRedirect: '/gallery/login'
  }
));

// router.get('/:id', (req, res) => {
//   Post.findById(`${req.params.id}`)
//   .then(function (image) {
//   Post.findAll({order: "id"})
//   .then(function (images) {
//     res.render('image', {image: image});
//   });
// });

router.get('/:id', (req, res) => {
  if(isLoggedIn(req)){
    Post.findById(`${req.params.id}`)
    .then(function (image) {
    Post.findAll({order: "id", limit:3})
    .then(function (images) {
      res.render('image', {image: image, images:images, username: req.user.user});
    });
  });
} else {
    Post.findById(`${req.params.id}`)
    .then(function (image) {
    Post.findAll({order: "id", limit:3})
    .then(function (images) {
      res.render('image', {image: image, images:images});
    });
  });
}
});

router.get('/:id/edit', myAuthenticator, (req, res) => {
  Post.findById(`${req.params.id}`)
  .then(function (images) {
    res.render('edit', {images: images, username: req.user.user});
  });
});

router.put('/:id', myAuthenticator, (req, res) => {
  Post.update(
  {
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  {where: {id: `${req.params.id}`}}
  )
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  });
});

router.delete('/:id', myAuthenticator, (req, res) => {
  Post.destroy(
  {
    where: {id: `${req.params.id}`}
  }
  )
  .then(function () {
    res.redirect(303, '/gallery');
  });
});

router.post('/', myAuthenticator, (req, res) => {
  Post.create(
    {
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    }
    )
    .then(function () {
      res.redirect(303, '/gallery');
    });
});

// router.post('/create_user', (req, res) => {
//   User.create(
//   {
//     user: req.body.username,
//     password: req.body.password
//   }
//   )
//   .then(function () {
//     res.redirect(303, '/gallery');
//   });
// });

router.post('/create_user', (req, res) => {
  console.log('req.body.username', req.body.username);
  console.log('req.body.password', req.body.password);

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      console.log("hash", hash);
        // Store hash in your password DB.
      User.create({
        user: req.body.username,
        password: hash
      })
      .then(function() {
        res.redirect(303, '/gallery/login');
      });
    });
  });
});

module.exports = router;