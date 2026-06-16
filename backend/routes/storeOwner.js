const express = require('express');
const router = express.Router();
const { verifyStoreOwner } = require('../middleware/auth');
const { getDashboard } = require('../controllers/storeOwnerController');

router.get('/dashboard', verifyStoreOwner, getDashboard);

module.exports = router; 
