const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  addUser,
  getUsers,
  getUserById,
  addStore,
  getStores,
} = require('../controllers/adminController');

router.get('/dashboard', verifyAdmin, getDashboardStats);
router.post('/users', verifyAdmin, addUser);
router.get('/users', verifyAdmin, getUsers);
router.get('/users/:id', verifyAdmin, getUserById);
router.post('/stores', verifyAdmin, addStore);
router.get('/stores', verifyAdmin, getStores);

module.exports = router; 
