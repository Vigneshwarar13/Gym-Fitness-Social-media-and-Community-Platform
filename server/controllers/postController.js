const Post = require('../models/Post');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { content, image } = req.body;

  try {
    const post = await Post.create({
      userId: req.user._id,
      content,
      image,
    });

    const populatedPost = await Post.findById(post._id).populate('userId', 'name profilePic');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (with pagination)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic');

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      text,
    };

    post.comments.push(newComment);

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
};
