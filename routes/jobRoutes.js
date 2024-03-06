const express = require('express');
const router = express.Router({ mergeParams: true });
const jobController = require('../controllers/jobController');

router.get('/jobs', jobController.getRiderActiveJob);

router.get('/jobsHistory', jobController.getRiderJobHistory);

router.post('/jobs/update-status', jobController.updateOrderStatus)

module.exports = router;
