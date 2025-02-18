CREATE DATABASE onmyshelf;

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    read_status VARCHAR(255),
    rating INT
);

INSERT INTO books (title, author, read_status, rating)
  VALUES ('1984', 'George Orwell', 'read', 4), ('Royal Assassin', 'Robin Hobb', 'to-be-read', 0);