import { useState, useEffect, useRef } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [result, setResult] = useState({}); // State for search result
  const [isLoading, setIsLoading] = useState(false); // State for showing fetching message
  const [error, setError] = useState(""); // State for error message
  const isMounted = useRef(false); // Ref to check if component is mounted

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to handle search. Fetch data from server based on search term.
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Initialize states
    setResult({}); 
    setError("");

    // Check if search term is empty
    if (!searchTerm.trim()) {
      // Set error message and return if search term is empty
      setError("Please enter a word to search.");
      return;
    }

    // Set is loading state to true
    setIsLoading(true);

    try {
      // Fetch data from server
      const response = await fetch(`http://localhost:3000/${searchTerm}`);

      // Check if response is ok
      if (!response.ok) {
        // Get error message from server
        const errorData = await response.json();
        // Throw new error with message received from server
        throw new Error(errorData.result);
      }

      // Get data from response
      const data = await response.json();

      // Check if component is still mounted
      if (isMounted.current) {
        // Set result state with data
        setResult(data);
      }
    } catch (error) {
      // Check if component is still mounted
      if (isMounted.current) {
        // Set error message to error state
        setError(error.message);
      }
    } finally {
      // Check if component is still mounted
      if (isMounted.current) {
        // Set is loading state to false
        setIsLoading(false);
      }
    }

    // Reset search term state
    setSearchTerm("");
  };

  return (
    <div className="contentDiv">
      <form action="submit" onSubmit={handleSearch}>
        <label>
          Enter a finnish word
          <input
            type="text"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
        </label>
        <button type="submit">Search</button>
        <div className="searchResultDiv">
          {isLoading && <p>Fetching...</p>}
          {error && <p>{`${error}`}</p>}
          {result.result && <h1>{result.result}</h1>}
        </div>
      </form>
    </div>
  );
};

export default Search;
