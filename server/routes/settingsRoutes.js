const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.put('/password', protect, changePassword);

module.exports = router;
