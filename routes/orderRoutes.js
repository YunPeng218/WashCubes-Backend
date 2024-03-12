const express = require('express');
const router = express.Router({ mergeParams: true });

const orderController = require('../controllers/orderController');

// USER ORDER ROUTES
router.get('/orders/user', orderController.displayUserOrders)
router.post('/orders/select-locker-site', orderController.getLockerCompartment);
router.post('/orders/create-order', orderController.createOrder);
router.post('/orders/confirm-order', orderController.confirmOrder);
router.post('/orders/cancel-order-creation', orderController.cancelOrderCreation);
router.post('/orders/confirm-drop-off', orderController.confirmOrderDropOff);
router.post('/orders/confirm-collection', orderController.confirmOrderCollection);
router.post('/orders/order-error/resolve', orderController.userResolveOrderError);
router.post('/orders/order-error/return', orderController.userRejectOrderError);

// RIDER ORDER ROUTES
router.get('/orders/ready-for-pickup/all-sites', orderController.getNumberOfOrdersReadyForPickup);
router.get('/orders/ready-for-dropoff/all-sites', orderController.getNumberOfOrdersReadyForDropoff);
router.get('/orders/ready-for-pickup', orderController.getOrdersReadyForPickup);
router.post('/orders/ready-for-pickup', orderController.confirmSelectedPickupOrders);
router.get('/orders/ready-for-pickup/laundry-site', orderController.getLaundrySiteOrdersReadyForPickup);
router.post('/orders/ready-for-pickup/laundry-site', orderController.confirmSelectedLaundrySitePickupOrders);

// OPERATOR ORDER ROUTES
router.get('/orders/operator', orderController.displayOrdersForOperator);
router.post('/orders/operator/approve-order-details', orderController.operatorApproveOrderDetails);
router.post('/orders/operator/confirm-processing-complete', orderController.operatorConfirmProcessingComplete);
router.patch('/orders/operator/edit-order-details', orderController.operatorEditOrderDetails);

module.exports = router;