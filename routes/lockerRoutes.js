const express = require('express');
const router = express.Router({ mergeParams: true });

const lockerController = require('../controllers/lockerController');

router.get('/lockers', lockerController.getLockers);

router.get('/locker/order-locker-sites', lockerController.getDropAndCollectionSite);

router.get('/compartments', lockerController.getAvailableCompartments);

router.post('/locker/release-compartment', lockerController.freeCompartment);

router.get('/test-locker', (req, res) => {
    res.json({ locker: 'WOW' });
});

router.get('/locker/qr-code', lockerController.handleLockerQRScan);

module.exports = router;
