const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', protect, deletePost);
router.post('/like/:id', protect, likePost);
router.post('/comment/:id', protect, addComment);

module.exports = router;
