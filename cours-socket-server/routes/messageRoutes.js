const express = require('express')
const router = express.Router();
const Validator = require('../utils/validator');

const MessageController = require('../controllers/messageController')
const messageMiddleware = require('../middlewares/messageMiddleware')

router.get('/', MessageController.getMessages);
router.post('/',messageMiddleware.validateMessage(Validator.messageCreation) , MessageController.createMessage)

module.exports = router;