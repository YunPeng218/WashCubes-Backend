const router = require("express").Router();
const OperatorController = require('../controllers/operatorController');

router.post("/registerOperator", OperatorController.register);
router.post("/loginOperator", OperatorController.login);
router.post("/changePassOperator", OperatorController.changePassword);
router.get("/operator", OperatorController.getOperatorDetails);
router.get("/admin/fetchOperators", OperatorController.displayAllOperatorsForAdmin);
router.delete('/deleteOperatorAccount', OperatorController.deleteOperatorAccount);

module.exports = router;