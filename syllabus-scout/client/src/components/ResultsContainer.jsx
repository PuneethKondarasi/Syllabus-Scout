import { useState } from 'react';
import BookCard from './BookCard';
import VideoCard from './VideoCard';

function ResultsContainer({ results, isLoading }) {
  const [activeTab, setActiveTab] = useState('all');
  const { books, videos } = results;
  
  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'books', label: `Books (${books.length})` },
    { id: 'videos', label: `Videos (${videos.length})` }
  ];
  
  // Filter results based on active tab
  const filteredResults = () => {
    switch (activeTab) {
      case 'books':
        return { books, videos: [] };
      case 'videos':
        return { books: [], videos };
      default:
        return { books, videos };
    }
  };
  
  const { books: filteredBooks, videos: filteredVideos } = filteredResults();
  
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Books section */}
      {filteredBooks.length > 0 && (
        <div className="mt-6">
          {activeTab === 'all' && (
            <h2 className="text-xl font-semibold mb-4">Books</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
      
      {/* Videos section */}
      {filteredVideos.length > 0 && (
        <div className="mt-6">
          {activeTab === 'all' && (
            <h2 className="text-xl font-semibold mb-4">Videos</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
      
      {/* No results message */}
      {filteredBooks.length === 0 && filteredVideos.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-12 px-4">
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsContainer;