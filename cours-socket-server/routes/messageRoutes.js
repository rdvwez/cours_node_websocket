const express = require('express')
const router = express.Router();
const Validator = require('../utils/validator');

const MessageController = require('../controllers/messageController')
const messageMiddleware = require('../middlewares/messageMiddleware')

router.get('/', MessageController.getMessages);
router.get('/last', MessageController.getLastMessage);
router.post('/', MessageController.createMessage)
module.exports = router;