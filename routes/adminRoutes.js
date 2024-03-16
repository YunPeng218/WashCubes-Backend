const router = require("express").Router();
const AdminController = require('../controllers/adminController');

router.post("/registerAdmin", AdminController.register);
router.post("/loginAdmin", AdminController.login);
router.post("/changePassAdmin", AdminController.changePassword);
router.get("/admin", AdminController.getAdminDetails);

module.exports = router;