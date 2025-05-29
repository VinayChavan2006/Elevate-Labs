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
git clone [https://github.com/VinayChavan2006/Elevate-Labs/main/task3](https://github.com/VinayChavan2006/Elevate-Labs.git)
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

- Use **Postman** to test the API Endpoints
- GET: '/books' - returns all the books
- POST: '/books' - add a new book to the list
- PUT: '/books/:id' - updates the attributes of book with the id from the params
- DELETE: '/books/:id' - delete the book with id which is in the params
  
