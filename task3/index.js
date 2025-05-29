import express from "express";
const app = express();
const PORT = 3000;

let bookList = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api requests
app.get("/books", (req, res) => {
  return res.json(bookList);
});

app.post("/books", (req, res) => {
  const { id, title, author } = req.body;
  if (!id || !title || !author) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (bookList.find((book) => book.id === parseInt(id))) {
    return res.status(400).json({ error: "Book with this ID already exists" });
  }

  const newBook = { id, title, author };
  bookList.push(newBook);
  return res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const bookIndex = bookList.findIndex((book) => book.id === parseInt(id));
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  if (!title || !author) {
    return res.status(400).json({ error: "All fields are required" });
  }
  bookList[bookIndex] = {
    id: parseInt(id),
    title,
    author,
  };
  return res.status(200).json(bookList[bookIndex]);
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const book = bookList.find((book) => book.id == parseInt(id));
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  bookList = bookList.filter((book) => book.id !== parseInt(id));
  return res.status(200).json({ message: "Book deleted successfully", book });
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
