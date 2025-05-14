"use client";

import Link from "next/link";
import styles from "./CurrentlyReading.module.css";
import BookFormModal from "../AddBookForm/BookFormModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CurrentlyReading() {
  // Fetch function to get books from the API
  const getBooks = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/books`
    );
    console.log("TEST DATA", response.data);
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // Add loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Currently Reading</h2>
      <div className={styles["currently-reading__books"]}>
        <ul>
          {data.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
            </li>
          ))}
        </ul>
        <button>
          <Link href="">Add a book</Link>
        </button>
      </div>
      <BookFormModal />
    </div>
  );
}
