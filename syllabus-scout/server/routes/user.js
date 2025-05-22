import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(403);

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get user profile by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'You can update only your profile' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password endpoint
router.put('/:id/change-password', verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'You can only change your own password' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get search history
router.get('/:id/search-history', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('searchHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.searchHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get watch history
router.get('/:id/watch-history', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('watchHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.watchHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add search query to history
router.post('/:id/add-search', verifyToken, async (req, res) => {
  try {
    const { query } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.searchHistory.unshift({ query, timestamp: new Date() });
    if (user.searchHistory.length > 10) user.searchHistory.pop();

    await user.save();
    res.json({ message: 'Search added to history' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add video to watch history
router.post('/:id/add-watch', verifyToken, async (req, res) => {
  try {
    const { videoId, videoTitle, videoThumbnail, videoChannel } = req.body;
    if (!videoTitle) {
      return res.status(400).json({ message: 'Video title is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingIndex = videoId 
      ? user.watchHistory.findIndex(item => item.videoId === videoId)
      : user.watchHistory.findIndex(item => item.videoTitle === videoTitle);

    if (existingIndex !== -1) {
      user.watchHistory.splice(existingIndex, 1);
    }

    const watchItem = {
      videoId: videoId || 'unknown',
      videoTitle,
      videoThumbnail: videoThumbnail || '',
      videoChannel: videoChannel || '',
      timestamp: new Date()
    };

    user.watchHistory.unshift(watchItem);
    if (user.watchHistory.length > 10) user.watchHistory.pop();

    await user.save();
    res.json({ message: 'Video added to history' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
