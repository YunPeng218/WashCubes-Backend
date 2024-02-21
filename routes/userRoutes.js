const router = require('express').Router();
const UserController = require('../controllers/userController');

router.post('/userVerification', UserController.userVerification);
router.post('/sendOTP', UserController.sendOTP);
router.get('/user', UserController.getUserDetails);
router.patch('/user', UserController.editUserDetails);
router.patch('/editPhoneNumber', UserController.editPhoneNumber);
router.patch('/userProfilePic', UserController.editUserProfilePic);
router.patch('/deleteFCMToken', UserController.deleteFCMToken);
router.patch('/addFCMToken', UserController.addFCMToken);

module.exports = router;