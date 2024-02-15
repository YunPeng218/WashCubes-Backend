const router = require('express').Router();
const UserController = require('../controllers/userController');

router.post('/registration', UserController.otpVerification);
router.post('/otpgenerator', UserController.otpGenerate);
router.get('/user', UserController.getUserDetails);
router.patch('/user', UserController.editUserDetails);
router.patch('/userProfilePic', UserController.editUserProfilePic);
router.patch('/deleteFCMToken', UserController.deleteFCMToken);
router.patch('/addFCMToken', UserController.addFCMToken);

module.exports = router;