const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }  else {
  return res.status(404).json({message: "Unable to register user."});
}
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve()
    },6000)})
    
    myPromise.then(() => {
  
      return res.status(300).json({message: books});
    })
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve()
    },6000)})
    
    myPromise.then(() => {
  
      return res.status(300).json({message: books[isbn]});
    })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let details = [];
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve()
    },6000)})
    
    myPromise.then(() => {
  
      for(var isbn in books)
        {
          if(author === books[isbn].author)
          { 
           details.push(books[isbn].title)
          }
        }    
       return res.status(300).json({message: details});
    })
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let details = [];
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve()
    },6000)})
    
    myPromise.then(() => {
  
      for(var isbn in books)
        {
          if(title === books[isbn].title)
          { 
           details.push(books[isbn])
          }
        }    
         return res.status(300).json({message: details});
    })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve()
    },6000)})
    
    myPromise.then(() => {
  
      return res.status(300).json({Book_ISBN : isbn,reviews: books[isbn].reviews});
    })
  
});

module.exports.general = public_users;
