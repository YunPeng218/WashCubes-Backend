const router = require('express').Router();
const UserController = require('../controllers/userController');

router.post('/registration', UserController.otpVerification);
router.post('/otpgenerator', UserController.otpGenerate);

module.exports = router;