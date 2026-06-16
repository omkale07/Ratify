const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getStores, submitRating, updateRating } = require('../controllers/userController');

router.get('/stores', verifyToken, getStores);
router.post('/ratings', verifyToken, submitRating);
router.put('/ratings', verifyToken, updateRating);

module.exports = router; 
