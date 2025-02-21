const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (!username) return false;

  const user = users.find(u => u.username === username);
  if (!user) {
    return false;
  }

  return true;
}

const authenticatedUser = (username, password)=>{ //returns boolean
  const user = users.find(u => u.username === username);
  if (!user) {
    return false;
  }

  if (user.password !== password) {
    return false;
  }

  return true;
}

// Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // if (!isValid(username) || !authenticatedUser(username, password)) {
  //   return res.status(400).json({message: "Invalid username or password"});
  // }

  const token = jwt.sign({ username: username }, 'your_secret_key');
  
  req.session.accessToken = token;

  return res.status(200).json({message: "Login successful", token});
});

// Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const text = req.body.review;
  // const username = req.session.authorization.username;

  // if (!username) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const book = books[isbn];

  if (book) {
    book.reviews[username] = text; 
    res.json({ message: "Review added successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
