const express = require('express');
const router = express.Router();
const {index, show, addReview, } = require('../controllers/moviesController');

router.get('/', index);
router.get('/:id', show);
router.post('/:id/reviews', addReview )
module.exports = router;
