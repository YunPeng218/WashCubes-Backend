const express = require('express');
const router = express.Router({ mergeParams: true });

const serviceController = require('../controllers/serviceController');

router.get('/services', serviceController.getAllServices);

router.get('/services/:serviceId', serviceController.getServiceDetails);

module.exports = router;