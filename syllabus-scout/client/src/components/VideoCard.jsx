import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VideoCard = ({ video }) => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const { 
    title = 'Unknown', 
    channel = 'Unknown Channel',
    thumbnail = '/api/placeholder/320/180',
    url,
    videoId = 'unknown',
    description
  } = video;

  // Function to add to watch history
  const addToWatchHistory = async () => {
    if (!auth?.user?._id || !auth?.token) return;
    
    setLoading(true);
    
    try {
      const api = axios.create({
        baseURL: 'http://localhost:5000/api'
      });
      
      // Add to watch history
      await api.post(
        `/user/${auth.user._id}/add-watch`,
        {
          videoId: videoId,
          videoTitle: title,
          videoThumbnail: thumbnail,
          videoChannel: channel
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      
      console.log('Added to watch history:', title);
    } catch (error) {
      console.error('Failed to add to watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle watch video click
  const handleWatchVideo = (e) => {
    addToWatchHistory();
  };

  return (
    <div className="card flex flex-col h-full">
      <div className="relative pb-[56.25%] w-full">
        <img
          src={thumbnail || '/api/placeholder/320/180'}
          alt={`Thumbnail for video: ${title}`}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t"
        />
        {/* Red play button overlay removed */}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
          {channel}
        </p>
        {/* Only show description if available */}
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-auto">
        <a
          href={url || `https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary text-sm w-full text-center flex items-center justify-center"
          onClick={handleWatchVideo}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Watch Video'}
        </a>
      </div>
    </div>
  );
};

export default VideoCard;