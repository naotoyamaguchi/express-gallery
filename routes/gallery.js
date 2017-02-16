const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
const db = require('../models');
var Post = db.Post;
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

router.get('/', (req, res) => {
  Post.findAll({order: "id"})
  .then(function (images) {
    res.render('index', {images: images});
  })
;});

router.get('/new', (req, res) => {
  res.render('form');
});

router.get('/:id', (req, res) => {
  Post.findById(`${req.params.id}`)
  .then(function (images) {
    res.render('image', {images: images});
  });
});

router.get('/:id/edit', (req, res) => {
  Post.findById(`${req.params.id}`)
  .then(function (images) {
    res.render('edit', {images: images});
  });
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Post.destroy(
  {
    where: {id: `${req.params.id}`}
  }
  )
  .then(function () {
    res.redirect(303, '/gallery');
  });
});

router.post('/', (req, res) => {
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

module.exports = router;