const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ratify-five.vercel.app'  
  ],
  credentials: true
}));

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes call
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/store-owner', require('./routes/storeOwner'));

// Test DB connection
db.query('SELECT 1')
  .then(() => console.log('MySQL connected successfully!'))
  .catch((err) => console.error('DB connection failed:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Ratify API is running!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});