import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [userData, setUserData] = useState(auth?.user || {});
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // API configuration with error handling
  const api = axios.create({
    baseURL: 'http://localhost:5000/api'
  });

  // Add interceptor to handle common response patterns
  api.interceptors.response.use(
    response => response.data,
    error => {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.user?._id || !auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        
        // Fetch user data
        const userData = await api.get(`/user/${auth.user._id}`, config);
        setUserData(userData);
        setFormData({ 
          username: userData.username, 
          email: userData.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Fetch search history
        const searchData = await api.get(`/user/${auth.user._id}/search-history`, config);
        setSearchHistory(searchData || []);
        
        // Fetch watch history
        const watchData = await api.get(`/user/${auth.user._id}/watch-history`, config);
        setWatchHistory(watchData || []);
      } catch (err) {
        setError('Could not load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when typing
    setMessage('');
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdate = async () => {
    if (!auth?.user?._id || !auth?.token) return;
    
    try {
      setError('');
      setMessage('');
      
      // Validate inputs
      if (!formData.username.trim() || !formData.email.trim()) {
        setError('Username and email are required');
        return;
      }
      
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      // Debug the API call
      console.log('Updating profile with data:', updateData);

      const response = await api.put(
        `/user/${auth.user._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      
      console.log('API Response:', response);

      // Update local state
      const updatedUser = {
        ...userData,
        username: formData.username,
        email: formData.email
      };
      
      setUserData(updatedUser);
      
      // Only update auth context if setAuth is available
      if (typeof setAuth === 'function') {
        try {
          setAuth(prev => ({
            ...prev,
            user: {
              ...prev.user,
              username: formData.username,
              email: formData.email
            }
          }));
        } catch (authError) {
          console.warn('Could not update auth context:', authError);
          // Continue anyway since we've updated local state
        }
      }
      
      setEditMode(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error('Update Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth?.user?._id || !auth?.token) return;
    
    // Form validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('New password and confirmation are required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword === formData.currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    try {
      setError('');
      setMessage('');
      
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      const response = await api.put(
        `/user/${auth.user._id}/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (response) {
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setPasswordMode(false);
        setMessage('Password updated successfully');
      }
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Current password is incorrect');
      } else {
        setError(err.response?.data?.message || 'Failed to update password');
      }
      
      // Clear password fields for security
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPasswordMode(false);
    setFormData({
      username: userData.username,
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setMessage('');
  };

  if (!auth) {
    return (
      <div className="p-8 text-center text-lg font-semibold text-red-500">
        Please log in to view your profile.
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl mt-10">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl">
          {message}
        </div>
      )}
      
      <div className="flex items-center space-x-6 mb-6">
        <FaUserCircle className="text-6xl text-gray-600 dark:text-white" />
        <div className="flex-1">
          {editMode ? (
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Email"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : passwordMode ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="Current Password"
                />
                <button 
                  onClick={() => togglePasswordVisibility('current')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  type="button"
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="New Password"
                />
                <button 
                  onClick={() => togglePasswordVisibility('new')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  type="button"
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="Confirm New Password"
                />
                <button 
                  onClick={() => togglePasswordVisibility('confirm')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  type="button"
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handlePasswordChange}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{userData.email}</p>
              <div className="mt-3 flex space-x-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setPasswordMode(true)}
                  className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Search History</h3>
          {searchHistory && searchHistory.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {searchHistory.map((item, idx) => (
                <li key={idx} className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="font-medium">{item.query}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No search history yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Watch History</h3>
          {watchHistory && watchHistory.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {watchHistory.map((item, idx) => (
                <li key={idx} className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="font-medium">{item.videoTitle}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No watch history yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;