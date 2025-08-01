const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token and set req.user
function auth(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// POST /user/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already taken" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// POST /user/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// PUT /user/update
// Requires auth middleware to verify user identity (make sure you have auth middleware implemented)
router.put('/update', auth, async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.userId, // Comes from decoded JWT by auth middleware
      { username, email, avatar },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update user" });
  }
});


module.exports = router;
