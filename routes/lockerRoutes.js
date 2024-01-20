const express = require('express');
const router = express.Router({ mergeParams: true });

const lockerController = require('../controllers/lockerController');

router.get('/lockers', lockerController.getLockers);

router.get('/compartments', lockerController.getAvailableCompartments);

module.exports = router;