const express = require('express');
const router = express.Router({ mergeParams: true });

const orderController = require('../controllers/orderController');

router.get('/orders/user', orderController.displayUserOrders)

router.post('/orders/select-locker-site', orderController.getLockerCompartment);

router.post('/orders/create-order', orderController.createOrder);

router.post('/orders/confirm-order', orderController.confirmOrder);

router.post('/orders/cancel-order-creation', orderController.cancelOrderCreation);

router.post('/orders/confirm-drop-off', orderController.confirmOrderDropOff);

router.get('/orders/ready-for-pickup', orderController.getOrdersReadyForPickup);

router.post('/orders/ready-for-pickup', orderController.confirmSelectedPickupOrders);

module.exports = router;