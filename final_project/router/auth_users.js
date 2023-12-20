const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  //returns boolean
 //write code to check is the username is valid
 let userswithsamename = users.filter((user)=>{
  return user.username === username
    });

  if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

const authenticatedUser = (username,password)=>{ 
  //returns boolean
 //write code to check if username and password match the one we have in records.
 let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
    if (isValid(username)) { 
      if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("User successfully logged in");
      } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
      } 
    } else {
      return res.status(404).json({message: "User doesn't exist.you can't login"});   
    }
});

// Add and Update book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const qryReview = req.body.review;
  let book;
  for (let i in books){
    if (i === isbn) {
      book = books[i];
    }
  }
// Check if  book not exist
  if (!book) {
    return res.status(404).send({ error: "Book not found." });
  }
// Check if Review text missing.
  if (!qryReview) {
    return res.status(400).send({ error: "Review text missing." });
  }

  // Check if user already has a review for this book
 
  if (!book.reviews[username]) {

  // Add book review
    book.reviews[username] = {review: qryReview };
    console.log("review not exist");
  } else {
  // Update book review
    book.reviews[username].review = qryReview;
    console.log("review exist");
  }

  // Update the book object directly in the 'books' list
  books[book] = book;

  // Send successful response with updated reviews
  res.send(JSON.stringify({Book_ISBN : isbn,  reviews: book.reviews }, null, 4));
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book;
  let bookindex;
  let book2 = {
    author: 'null',
    title: 'null',
    reviews: {}
  };
  for (let i in books){
    if (i === isbn) {
      book = books[i];
      bookindex = i;
    }
  }
// Check if  book not exist
  if (!book) {
    return res.status(404).send({ error: "Book not found." });
  }
  book2.author = book.author;
  book2.title = book.title;
  for (let i in book.reviews){
    if (!(i === username)) {
      book2.reviews[i] = {review: book.reviews[i].review }
    }
  }
  books[isbn] = book2;
  res.send(JSON.stringify({Book_ISBN : isbn,  reviews: book2.reviews }, null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
