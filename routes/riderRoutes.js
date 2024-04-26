const router = require("express").Router();
const RiderController = require('../controllers/riderController');

router.post("/registerRider",RiderController.register);
router.post("/loginRider", RiderController.login);
router.post("/resetPassRequest", RiderController.resetPassRequest);
router.post("/changePass", RiderController.changePassword);
router.get("/rider", RiderController.getRiderDetails);
router.get("/admin/fetchRiders", RiderController.displayAllRidersForAdmin);
router.delete('/deleteRiderAccount', RiderController.deleteRiderAccount);

module.exports = router;