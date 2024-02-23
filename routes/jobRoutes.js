const express = require('express');
const router = express.Router({ mergeParams: true });
const jobController = require('../controllers/jobController');

router.get('/jobs', jobController.getRiderActiveJob);

module.exports = router;
