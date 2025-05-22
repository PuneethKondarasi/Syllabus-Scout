import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.get('/all', async (req, res) => {
  const query = req.query.query;
  const maxResults = req.query.maxResults || 15; // Allow configurable result count
  const maxbookResults = req.query.maxbookResults || 10; // Allow configurable result count

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // 📚 Fetch Books from Open Library with improved relevance
    const bookRes = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    
    // Filter books for better relevance
    const books = bookRes.data.docs
      .map(book => ({
        book,
        relevanceScore: calculateBookRelevance(book, query)
      }))
      // Sort by our calculated relevance score
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(({ book }) => ({
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        year: book.first_publish_year || 'N/A',
        cover: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : 'https://via.placeholder.com/150x220?text=No+Cover',
        description: book.subtitle || 'No description available.',
        link: `https://openlibrary.org${book.key}`,
      }))
      .slice(0, maxbookResults);

    // 📺 Fetch YouTube Videos with improved relevance
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    
    // Enhanced YouTube search with relevance, popularity and filtering
    const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=20&type=video&videoCategoryId=27&order=viewCount&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`;

    const youtubeRes = await axios.get(YOUTUBE_URL);
    
    // Get video IDs for fetching view counts
    const videoIds = youtubeRes.data.items.map(item => item.id.videoId).join(',');
    
    // Get detailed video information including view counts
    const videoDetailsRes = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    // Create a map of video details by ID
    const videoDetailsMap = {};
    videoDetailsRes.data.items.forEach(item => {
      videoDetailsMap[item.id] = {
        viewCount: Number(item.statistics.viewCount) || 0,
        duration: item.contentDetails.duration,
        isShort: isYoutubeShort(item.contentDetails.duration, item.statistics.viewCount)
      };
    });
    
    // Filter and map videos
    const videos = [];
    const includedChannels = new Set(); // Track channels we've already included
    
    youtubeRes.data.items
      // Filter out shorts and irrelevant videos
      .filter(item => {
        const details = videoDetailsMap[item.id.videoId];
        if (!details) return false;
        
        // Skip shorts
        if (details.isShort) return false;
        
        // Check relevance (title must contain query terms)
        const titleLower = item.snippet.title.toLowerCase();
        const queryTerms = query.toLowerCase().split(' ');
        const relevantTitle = queryTerms.some(term => titleLower.includes(term));
        
        return relevantTitle;
      })
      // Sort by view count before filtering by channel (so we get the most popular video from each channel)
      .sort((a, b) => {
        const viewsA = videoDetailsMap[a.id.videoId]?.viewCount || 0;
        const viewsB = videoDetailsMap[b.id.videoId]?.viewCount || 0;
        return viewsB - viewsA;
      })
      // Process each item and add to videos array if it passes channel filter
      .forEach((item) => {
        const channelId = item.snippet.channelId;
        
        // Skip if we already have a video from this channel
        if (includedChannels.has(channelId)) {
          return;
        }
        
        const details = videoDetailsMap[item.id.videoId];
        
        videos.push({
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
          videoId: item.id.videoId,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          viewCount: details?.viewCount || 0,
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description,
          duration: formatDuration(details?.duration || 'PT0M0S')
        });
        
        // Mark this channel as included
        includedChannels.add(channelId);
        
        // Stop adding videos once we've reached the limit
        if (videos.length >= maxResults) {
          return;
        }
      });

    // ✅ Return both books and videos
    res.json({ books, videos });
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ error: 'Failed to fetch search data' });
  }
});

// Helper function to calculate book relevance score
function calculateBookRelevance(book, query) {
  let score = 0;
  const queryTerms = query.toLowerCase().split(' ');
  
  // Check title for query terms
  if (book.title) {
    const titleLower = book.title.toLowerCase();
    queryTerms.forEach(term => {
      if (titleLower.includes(term)) score += 5;
    });
    
    // Exact match is even better
    if (titleLower === query.toLowerCase()) score += 10;
  }
  
  // Check subjects for query terms
  if (book.subject) {
    queryTerms.forEach(term => {
      book.subject.forEach(subject => {
        if (subject.toLowerCase().includes(term)) score += 3;
      });
    });
  }
  
  // Check author for query terms
  if (book.author_name && book.author_name.length > 0) {
    const authorString = book.author_name.join(' ').toLowerCase();
    queryTerms.forEach(term => {
      if (authorString.includes(term)) score += 4;
    });
  }
  
  // Give preference to books with covers
  if (book.cover_i) score += 2;
  
  // Give preference to books with ratings
  if (book.ratings_average) score += book.ratings_average;
  
  return score;
}

// Helper function to determine if a video is a short
function isYoutubeShort(duration, viewCount) {
  // Parse the ISO 8601 duration format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  // Calculate total duration in seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  // Consider videos under 60 seconds as potential shorts
  if (totalSeconds <= 60) return true;
  
  // Videos under 5 minutes with very high view count might also be shorts
  if (totalSeconds < 300 && viewCount > 1000000) {
    return true;
  }
  
  return false;
}

// Helper function to format duration
function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default router;