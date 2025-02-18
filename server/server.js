const express = require("express");
const pool = require("./db/db");
const prisma = require("./db/prisma");

const app = express();
const cors = require("cors");
const PORT = 8080;

app.use(cors());

app.get("/api/home", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/api/books", async (req, res) => {
  try {
    // Query the 'books' table
    const books = await prisma.book.findMany();

    const titles = books.map((book) => book.title);

    // Send the data back as a JSON response
    res.send(titles); // result.rows contains the query results
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
