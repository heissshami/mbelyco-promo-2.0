const db = require('../db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Email, current password, and new password are required.' });
  }

  try {
    const { rows } = await db.query('SELECT password FROM users WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    if (currentPassword !== user.password) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    await db.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};