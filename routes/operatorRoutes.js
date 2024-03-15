const router = require("express").Router();
const OperatorController = require('../controllers/operatorController');

router.post("/registerOperator", OperatorController.register);
router.post("/loginOperator", OperatorController.login);
router.post("/resetPassRequestOperator", OperatorController.resetPassRequest);
router.post("/changePassOperator", OperatorController.changePassword);
router.get("/operator", OperatorController.getOperatorDetails);

module.exports = router;