const db = require('../config/db');

// GET ALL STORES (for normal users)
const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

    const validSortFields = ['name', 'address'];
    const validOrders = ['ASC', 'DESC'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

    let query = `
      SELECT 
        s.id, s.name, s.address,
        ROUND(AVG(r.rating), 1) as avgRating,
        (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as userRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [req.user.id];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortField} ${sortOrder}`;

    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// SUBMIT RATING
const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Check if store exists
    const [store] = await db.query('SELECT id FROM stores WHERE id = ?', [store_id]);
    if (store.length === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    // Check if already rated
    const [existing] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store. Use update instead.' });
    }

    await db.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [user_id, store_id, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// UPDATE RATING
const updateRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const [existing] = await db.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'No rating found to update.' });
    }

    await db.query(
      'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
      [rating, user_id, store_id]
    );

    res.json({ message: 'Rating updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getStores, submitRating, updateRating };
