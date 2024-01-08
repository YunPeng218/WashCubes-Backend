const router = require('express').Router();
const UserController = require('../controllers/userController');

router.post('/registration', UserController.register);
router.post('/otpverification', UserController.otpVerification);

module.exports = router;