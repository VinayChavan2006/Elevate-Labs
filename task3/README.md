# Book List Management API

This is a simple Express.js REST API for managing a list of books. You can view, add, update, and delete books.

## Features

- View all books
- Add a new book
- Update an existing book
- Delete a book

## Requirements
- Node js
- express(npm package)

## Installation
- Clone the Repository
 ```
git clone https://github.com/VinayChavan2006/Elevate-Labs.git
cd Elevate-Labs/task3
 ```
- Run the command
```
npm init -y
npm install express
```
- Start the server
```
node index.js
```
Now server will be running on http://localhost:3000

## API Endpoints

### Get all books

- **GET** `/books`
- **Response:** Array of book objects

### Add a new book

- **POST** `/books`
- **Body:** JSON  
  ```
  {
    "id": 2,
    "title": "Book Title",
    "author": "Author Name"
  }
  ```
- **Response:** The created book object

### Update a book

- **PUT** `/books/:id`
- **Body:** JSON  
  ```
  {
    "title": "Updated Title",
    "author": "Updated Author"
  }
  ```
- **Response:** The updated book object

### Delete a book

- **DELETE** `/books/:id`
- **Response:** Success message and deleted book object

## Notes

- All endpoints expect and return JSON.
- The book list is stored in memory and will reset when the server restarts.


  
