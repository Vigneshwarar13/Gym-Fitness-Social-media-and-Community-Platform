const Workout = require('../models/Workout');

// @desc    Add a workout
// @route   POST /api/workouts
// @access  Private
const addWorkout = async (req, res) => {
  const { date, exercises, caloriesBurned, notes } = req.body;

  try {
    const workout = await Workout.create({
      userId: req.user._id,
      date,
      exercises,
      caloriesBurned,
      notes,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get workouts for a user
// @route   GET /api/workouts/:userId
// @access  Private
const getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this workout' });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this workout' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workout removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addWorkout,
  getUserWorkouts,
  updateWorkout,
  deleteWorkout,
};
