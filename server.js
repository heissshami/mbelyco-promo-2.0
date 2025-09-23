require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});