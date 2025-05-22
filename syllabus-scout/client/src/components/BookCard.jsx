function BookCard({ book }) {
  const imageUrl = book.cover || 'https://via.placeholder.com/128x192?text=No+Cover';
  const authors = book.author || 'Unknown Author';
  const publishedYear = book.year || 'N/A';
  const infoLink = book.link || '#';

  return (
    <div className="card flex flex-col h-full">
      <div className="p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0 flex justify-center">
          <img
            src={imageUrl}
            alt={`Cover of ${book.title}`}
            className="w-32 h-48 object-cover rounded shadow-md"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
            {book.title}
          </h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
            {authors}
          </p>
        </div>
      </div>
      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{publishedYear}</span>
          <a
            href={infoLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary text-sm py-1"
          >
            View Book
          </a>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
