const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
