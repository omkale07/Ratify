const db = require('../config/db');

// GET STORE OWNER DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // Get store details
    const [stores] = await db.query(
      'SELECT * FROM stores WHERE owner_id = ?', [owner_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner.' });
    }

    const store = stores[0];

    // Get average rating
    const [[{ avgRating }]] = await db.query(
      'SELECT ROUND(AVG(rating), 1) as avgRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    // Get users who rated
    const [raters] = await db.query(
      `SELECT u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating: avgRating || 0,
      },
      raters,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getDashboard };
