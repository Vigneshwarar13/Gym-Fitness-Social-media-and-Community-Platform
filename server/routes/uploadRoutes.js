const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
