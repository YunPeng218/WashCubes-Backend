const express = require('express');
const router = express.Router({ mergeParams: true });

const orderController = require('../controllers/orderController');

router.get('/orders', orderController.displayOrders)

router.get('/orders/create', orderController.renderCreateOrderForm);

router.post('/orders/select-locker-site', orderController.getLockerCompartment);

router.post('/orders/confirmOrder', orderController.confirmOrder);

module.exports = router;