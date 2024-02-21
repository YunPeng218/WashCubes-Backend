const router = require("express").Router();
const RiderController = require('../controllers/riderController');

router.post("/registerRider",RiderController.register);
router.post("/loginRider", RiderController.login);
router.post("/resetPassRequest", RiderController.resetPassRequest);
router.post("/changePass", RiderController.changePassword);


module.exports = router;