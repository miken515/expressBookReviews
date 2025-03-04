const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 1
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // return res.status(200).json({books});

  try {
    const data = await new Promise((resolve) => {
      resolve(books);
    });
    res.status(200).json(data, null, 4);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  // if (books[isbn]) {
  //   return res.status(200).json(books[isbn]);
  // } else {
  //   return res.status(404).json({ message: "Book not found" });
  // }
  new Promise((resolve) => {
      resolve(books[isbn]);
  })
  .then((data) => {
      res.send(JSON.stringify(data, null, 4));
  })
  .catch((error) => {
      res.status(500).json({ message: error.message });
  });
});

// Task 3
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const authorBooks = [];  
  
  // for (const book in books) {
  //   if ((books[book].author).toLowerCase() === author.toLowerCase()) {  
  //     authorBooks.push(books[book]);
  //   }
  // }
  
  // if (authorBooks.length > 0) {  
  //   res.status(200).json(authorBooks);  
  // } else {
  //   res.status(404).send('No books found for author');  
  // }
  new Promise((resolve) => {
    for (const book in books) {
      if ((books[book].author).toLowerCase() === author.toLowerCase()) {  
        authorBooks.push(books[book]);
      }
    }
    resolve(authorBooks);
  })
  .then((data) => {
      res.send(JSON.stringify(data, null, 4));
  })
  .catch((error) => {
      res.status(500).json({ message: error.message });
  });
});

// Task 4
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  // const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // }
  // else {
  //   return res.status(404).json({message: "Book not found"});
  // }

  new Promise((resolve) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    resolve(filteredBooks);
  })
  .then((data) => {
    res.send(JSON.stringify(data, null, 4));
  })
  .catch((error) => {
    res.status(500).json({ message: error.message });
  });
});

// Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const requestedIsbn = req.params.isbn;
  const book = books[requestedIsbn];

  if (book) {
    const reviews = book.reviews;
    res.status(200).json(reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
