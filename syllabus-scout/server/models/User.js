import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  searchHistory: [{
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  watchHistory: [{
    videoId: { type: String, required: true },
    videoTitle: { type: String, required: true },
    videoThumbnail: { type: String },
    videoChannel: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
});

// Create and export the model
const User = mongoose.model('User', userSchema);
export default User;