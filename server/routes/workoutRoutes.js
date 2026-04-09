const express = require('express');
const router = express.Router();
const {
  addWorkout,
  getUserWorkouts,
  updateWorkout,
  deleteWorkout,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addWorkout);
router.get('/:userId', protect, getUserWorkouts);
router.put('/:id', protect, updateWorkout);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;
