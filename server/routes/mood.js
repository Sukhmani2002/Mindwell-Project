const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { logMood, getMoodHistory, deleteMood } = require('../controllers/moodController');

router.use(protect);
router.post('/', logMood);
router.get('/history', getMoodHistory);
router.delete('/:id', deleteMood);

module.exports = router;
