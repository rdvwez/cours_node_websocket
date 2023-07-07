const express = require('express')
const router = express.Router();
const Validator = require('../utils/validator');

const createUserController = require('../controllers/createUserController')
const getUserController = require('../controllers/getUsersController')

const createUserMiddleware = require('../middlewares/createUserMiddleware')

router.get('/', getUserController.getUsers);


//Ajout de la route de desabonnement
router.post('/',createUserMiddleware.validateUserCreation(Validator.userCreation) , createUserController.createUser)

module.exports = router;