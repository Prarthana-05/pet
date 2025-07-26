const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // 🛠 Include role in payload
    'abcdefghi1234',
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
