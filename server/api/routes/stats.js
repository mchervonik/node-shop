const express = require('express');
const router = express.Router();


const StatController = require('../controllers/stats');

router.get('/', StatController.stats_get_all);

module.exports = router;