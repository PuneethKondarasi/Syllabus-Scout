import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('🔐 Auth route is working. Use POST /register or /login');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Register Request:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ username, email, password: hashedPassword });
    console.log('User registered:', newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Register Error:', error.message);
    console.error('Stack Trace:', error.stack);

    if (error.name === 'ValidationError') {
      for (let field in error.errors) {
        console.error(`${field}: ${error.errors[field].message}`);
      }
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Request:', req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User logged in:', user);

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login Error:', error.message);
    console.error('Stack Trace:', error.stack);

    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
