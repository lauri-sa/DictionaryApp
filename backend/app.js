const express = require("express");
const utils = require("./utils.js");

var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

// GET request to fetch all entries in the dictionary
app.get("/", (req, res) => {
  utils.createDictionary((err, dictionary) => {
    if (err){
      // If there's an error reading the file, return a server error
      return res.status(500).json({result: err.message});
    }

    res.json(dictionary);
  });
})

// GET request to search for a word in the dictionary (Finnish to English)
app.get("/:word", (req, res) => {
  const word = req.params.word; // Extract the Finnish word from the URL

  // Check if the word is valid
  if (!utils.isValidWord(word)) {
    return res.status(400).json({ result: "Invalid input. The input must contain only alphabetic characters and be at least 2 characters long." });
  }

  // Read the dictionary and search for the translation
  utils.createDictionary((err, dictionary) => {
    if (err) {
      // If there's an error reading the file, return a server error
      return res.status(500).json({ result: err.message});
    }

    let resultObject = {
      result: "No results", // Default message if the word is not found
    };

    // Loop through the dictionary to find the translation
    dictionary.forEach((wordPair) => {
      if (wordPair.fin === word) {
        resultObject.result = wordPair.eng; // Set the translation if found
      }
    });

    res.json(resultObject); // Return the result (either the translation or "No results")
  });
});

// POST request to add a new word pair using URL parameters
app.post("/:word1/:word2", (req, res) => {
  const word1 = req.params.word1; // Get the Finnish word from the URL
  const word2 = req.params.word2; // Get the English word from the URL

  // Check if the words are valid
  if (!utils.isValidWord(word1) || !utils.isValidWord(word2)) {
    return res.status(400).json({ result: "Invalid input. The input must contain only alphabetic characters and be at least 2 characters long." });
  }

  // Append the new word pair to the file
  utils.appendToFile(word1, word2, (err) => {
    if (err) {
      // Return an error response if file writing fails
      return res.status(500).json({result: err.message});
    }

    // If appending succeeded, return the updated dictionary
    utils.createDictionary((err, dictionary) => {
      if (err) {
        return res.status(500).json({result: err.message});
      }

      res.json(dictionary); // Return the updated dictionary
    });
  });
});

// POST request to add a new word pair using the request body
app.post("/add", (req, res) => {
  const { fin, eng } = req.body; // Destructure the Finnish and English words from the request body

  // Validate the input: Check that both fields are provided and the inputs are valid
  if (!fin && !eng) {
    return res.status(400).json({ result: "Both 'fin' and 'eng' fields are required." });
  } else if (!fin) {
    return res.status(400).json({ result: "'fin' field is required." });
  } else if (!eng) {
    return res.status(400).json({ result: "'eng' field is required." });
  } else if (!utils.isValidWord(fin)) {
    return res.status(400).json({ result: "Invalid 'fin' field. It must contain only alphabetic characters and be at least 2 characters long." });
  } else if (!utils.isValidWord(eng)) {
    return res.status(400).json({ result: "Invalid 'eng' field. It must contain only alphabetic characters and be at least 2 characters long." });
  }

  // Append the new word pair to the file
  utils.appendToFile(fin, eng, (err) => {
    if (err) {
      // Return an error response if file writing fails
      return res.status(500).json({result: err.message});
    }

    // If appending succeeded, return the updated dictionary
    utils.createDictionary((err, dictionary) => {
      if (err) {
        return res.status(500).json({result: err.message});
      }

      res.json(dictionary); // Return the updated dictionary
    });
  });
});

// Start the server on port 3000 and listen for requests
app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
