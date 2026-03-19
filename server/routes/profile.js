const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/profileController');

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', changePassword);
router.delete('/', deleteAccount);

module.exports = router;
