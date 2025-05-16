const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {index, show, addReview, createMovie, } = require('../controllers/moviesController');

router.get('/', index);
router.get('/:id', show);
router.post('/:id/reviews', addReview)
router.post('/',upload.single('image'), createMovie)
module.exports = router;
