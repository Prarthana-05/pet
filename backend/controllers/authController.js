const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ email, name, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
       email: user.email,
  role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role, // ✅ Include this
         email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
