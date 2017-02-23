const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const db = require('../models');
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



router.get('/', (req, res) => {
  Post.findAll({order: "id"})
  .then(function (images) {
    res.render('index', {images: images});
  });
});

router.get('/new', myAuthenticator, (req, res) => {
  res.render('form');
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

router.get('/:id', (req, res) => {
  Post.findById(`${req.params.id}`)
  .then(function (images) {
    res.render('image', {images: images});
  });
});

router.get('/:id/edit', myAuthenticator, (req, res) => {
  Post.findById(`${req.params.id}`)
  .then(function (images) {
    res.render('edit', {images: images});
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

router.post('/create_user', (req, res) => {
  User.create(
  {
    user: req.body.username,
    password: req.body.password
  }
  )
  .then(function () {
    res.redirect(303, '/gallery');
  });
});

module.exports = router;