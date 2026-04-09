require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Post = require('./models/Post');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Workout.deleteMany();
    await Post.deleteMany();

    // Create Sample Users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Fitness enthusiast',
        fitnessGoals: 'Build muscle',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Yoga lover',
        fitnessGoals: 'Improve flexibility',
      },
    ]);

    console.log('Sample users created');

    // Create Sample Workouts
    await Workout.create([
      {
        userId: users[0]._id,
        date: new Date(),
        exercises: [
          { name: 'Bench Press', sets: 3, reps: 10, weight: 60 },
          { name: 'Squats', sets: 4, reps: 12, weight: 80 },
        ],
        caloriesBurned: 300,
        notes: 'Great session today!',
      },
    ]);

    console.log('Sample workouts created');

    // Create Sample Posts
    await Post.create([
      {
        userId: users[0]._id,
        content: 'Just finished a heavy leg day! #fitness #motivation',
        likes: [users[1]._id],
        comments: [
          { userId: users[1]._id, text: 'Awesome work John!' }
        ]
      },
      {
        userId: users[1]._id,
        content: 'Started my morning with 30 mins of yoga. Feeling refreshed.',
      }
    ]);

    console.log('Sample posts created');
    console.log('Data Seeding Completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
