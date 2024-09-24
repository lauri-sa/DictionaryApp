const fs = require("fs");

// Function to check if the file exists
const fileExists = (path) => fs.existsSync(path);

// Function to check if a word is valid (only contains letters and has at least 2 letters)
const isValidWord = (word) => /^[a-zA-ZåäöÅÄÖ]{2,}$/.test(word);

// Function to create a dictionary from a file
// Reads the file 'sanakirja.txt', splits it into lines, and then into word pairs (Finnish and English)
const createDictionary = (callback) => {
  // Check if the file exists
  if (!fileExists("./sanakirja.txt")) {
    return callback(new Error("Dictionary file does not exists."));
  }

  // Read the dictionary file asynchronously
  const data = fs.readFile(
    "./sanakirja.txt",
    {
      encoding: "utf8", // Read the file as a UTF-8 encoded string
      flag: "r", // Open the file for reading
    },
    (err, data) => {
      // Callback for handling the result of reading the file
      if (err) {
        console.error("Error reading a file: ", err); // Log the error to the console
        return callback(err); // Return the error to the caller
      }

      let dictionary = [];

      // Split the file content by line
      const splitLines = data.split(/\r?\n/);

      // Process each line in the file
      splitLines.forEach((line) => {
        const words = line.split(" "); // Split the line into two words

        const word = {
          fin: words[0], // First word is the Finnish word
          eng: words[1], // Second word is the English word
        };

        dictionary.push(word); // Add the word pair to the dictionary array
      });

      // Call the callback with the resulting dictionary
      callback(null, dictionary);
    }
  );
};

// Function to append a word pair (Finnish and English) to the file
const appendToFile = (word1, word2, callback) => {
  // Check if the file exists
  if (!fileExists("./sanakirja.txt")) {
    // Create the file if it does not exists and add the first word pair
    fs.writeFile("./sanakirja.txt", `${word1} ${word2}\n`, (err) => {
      if (err) {
        console.error("Error creating file: ", err); // Log the error to the console
        return callback(err); // Return the error to the caller
      }

      callback(null); // Indicate success by calling the callback without an error
    });
  } else {
    createDictionary((err, dictionary) => {
      // Return an error if reading the dictionary fails
      if (err) {
        return callback(err);
      }

      // Check if the word pair already exists in the dictionary
      const wordExists = dictionary.some(
        (word) => word.fin === word1 && word.eng === word2
      );

      // Return an error if the word pair already exists
      if (wordExists) {
        return callback(
          new Error("Word pair already exists in the dictionary.")
        );
      }

      // Append the word pair if the file exists
      fs.appendFile("./sanakirja.txt", `\n${word1} ${word2}`, (err) => {
        if (err) {
          console.error("Error writing to file: ", err);
          callback(err);
        }

        callback(null);
      });
    });
  }
};

// Export the functions to make them accessible to other modules
module.exports = {
  isValidWord,
  createDictionary,
  appendToFile,
};
