import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ResultsContainer from "../components/ResultsContainer";
import LoadingSpinner from "../components/LoadingSpinner";

function Results() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  const [results, setResults] = useState({ books: [], videos: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);

    // Fetch results using the correct endpoint
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search/all?query=${query}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setResults({ books: [], videos: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Results for "{query}"
          </h1>
          {!isLoading && (
            <p className="text-gray-600 dark:text-gray-300">
              Found {results.books?.length + results.videos?.length} learning resources
            </p>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResultsContainer results={results} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

export default Results;