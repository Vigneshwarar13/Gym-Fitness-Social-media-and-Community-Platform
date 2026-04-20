const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect } = require('../middleware/auth');
const path = require('path');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    // Return local file path
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      public_id: req.file.filename,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
