const express = require('express');
const router = express.Router({ mergeParams: true });

const orderController = require('../controllers/orderController');

router.get('/orders', orderController.displayOrders)

router.post('/orders/select-locker-site', orderController.getLockerCompartment);

router.post('/orders/create-order', orderController.createOrder);

router.post('/orders/confirm-order', orderController.confirmOrder);

router.post('/orders/cancel-order-creation', orderController.cancelOrderCreation);

module.exports = router;