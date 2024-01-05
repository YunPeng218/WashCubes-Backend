const express = require('express');
const router = express.Router({ mergeParams: true });

const orderController = require('../controllers/orderController');

router.get('/order/create', orderController.renderCreateOrderForm);

router.post('/order/submitOrder', orderController.createOrder);

router.post('/order/confirmOrder', orderController.confirmOrder);

module.exports = router;