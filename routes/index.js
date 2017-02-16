const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();
router.use(bodyparser.urlencoded({extended: true}));
router.use(bodyparser.json());

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;