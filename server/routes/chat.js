const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMessage, getChatHistory, deleteSession } = require('../controllers/chatController');

router.use(protect);
router.post('/', sendMessage);
router.get('/history', getChatHistory);
router.delete('/:id', deleteSession);

module.exports = router;
