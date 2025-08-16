const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load .env

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // 🛠 Include role in payload
    process.env.JWT_SECRET,   // use env variable
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
