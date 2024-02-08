const express = require('express');
const router = express.Router({ mergeParams: true });

const lockerController = require('../controllers/lockerController');

router.get('/lockers', lockerController.getLockers);

router.get('/compartments', lockerController.getAvailableCompartments);

router.get('/test-locker', (req, res) => {
    res.json({ locker: 'WOW' });
});

module.exports = router;