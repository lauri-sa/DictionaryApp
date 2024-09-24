import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/Add.css";

const Add = () => {
  const [wordPair, setWordPair] = useState({ fin: "", eng: "" }); // State for input fields
  const [dictionary, setDictionary] = useState([]); // State for dictionary
  const [isFetching, setIsFetching] = useState(false); // State for showing fetching message
  const [isAdding, setIsAdding] = useState(false); // State for showing adding message
  const [error, setError] = useState(""); // State for error message
  const isMounted = useRef(false); // Ref to check if component is mounted

  // Fetch dictionary from server
  const fetchDictionary = useCallback(async () => {
    // Initialize error message and set isFetching state
    setError("");
    setIsFetching(true);

    try {
      // Fetch data from server
      const response = await fetch("http://localhost:3000/");

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
        // Set dictionary state
        setDictionary(data);
      }
    } catch (error) {
      if (isMounted.current) {
        handleError(error);
      }
    } finally {
      if (isMounted.current) {
        // Set isFetching state to false
        setIsFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    // Set isMounted ref to true
    isMounted.current = true;
    fetchDictionary();
    // Clean up function
    return () => {
      isMounted.current = false;
    };
  }, [fetchDictionary]);

  // Timer to try to fetch dictionary again if any other than server connection error occurs
  useEffect(() => {
    // Check if error message exists and if it does not include "Unable"
    if (error && !error.includes("Unable")) {
      // Set timer to try to fetch dictionary again after 5 seconds
      const timer = setTimeout(() => {
        fetchDictionary();
      }, 5000);

      // Clean up function to clear timer if component is unmounted
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, fetchDictionary]);
  
  // Function to handle errors. Set error message to state based on error message.
  const handleError = (error) => {
    if (error.message === "Failed to fetch") {
      setError("Unable to reach server. Retry to fetch the dictionary.");
    } else {
      setError(error.message);
    }
  };

  // Function to handle changes in input fields. Set value to state based on input field name.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setWordPair((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submit.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit

    // Initialize error message, dictionary and isAdding state
    setError("");
    setDictionary([]);
    setIsAdding(true); 

    try {
      // Post data to server and wait for response
      const response = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wordPair),
      });

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
        // Set dictionary state
        setDictionary(data);
      }
    } catch (error) {
      if (isMounted.current) {
        handleError(error);
      }
    } finally {
      if (isMounted.current) {
        // Set isAdding state to false
        setIsAdding(false);
      }
    }

    // Reset input fields
    setWordPair({ fin: "", eng: "" });
  };

  return (
    <div className="contentDiv">
      <form action="submit" onSubmit={handleSubmit}>
        <label>
          Enter a finnish word
          <input
            type="text"
            name="fin"
            onChange={handleChange}
            value={wordPair.fin}
          />
        </label>
        <label>
          Enter a english word
          <input
            type="text"
            name="eng"
            onChange={handleChange}
            value={wordPair.eng}
          />
        </label>
        <button type="submit">Submit</button>
        <h2>Wordpairs</h2>
        {!dictionary.length && (
          <div className="errorDiv">
            {isAdding && <p>Adding...</p>}
            {isFetching && <p>Fetching...</p>}
            {error && (
              <>
                <p>{error}</p>
                {error.includes("Unable") && (
                  <button
                    className="reloadButton"
                    type="button"
                    onClick={fetchDictionary}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {dictionary.length > 0 && (
          <div className="dictionaryDiv">
            {dictionary.map((words, index) => (
              <p key={index}>{`${words.fin} = ${words.eng}`}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default Add;
