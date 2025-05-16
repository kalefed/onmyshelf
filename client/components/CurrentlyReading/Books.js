"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/books";

export default function CurrentlyReadingBooks() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // Add loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((book) => (
        <li key={book.id}>
          <strong>{book.title}</strong> by {book.author}
        </li>
      ))}
    </ul>
  );
}
