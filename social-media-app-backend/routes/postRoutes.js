const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.delete('/:id', deletePost);

module.exports = router;
