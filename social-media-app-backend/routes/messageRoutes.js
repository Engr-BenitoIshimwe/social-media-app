const express = require('express');
const {
  sendMessage,
  getMessages,
  getMessage,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/', getMessages);
router.get('/:id', getMessage);

module.exports = router;
