"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooksOnShelf } from "@/services/books";

export default function CurrentlyReadingBooks() {
  const shelf_type = "currently-reading";

  const { data, error, isLoading } = useQuery({
    queryKey: ["books", shelf_type],
    queryFn: () => getBooksOnShelf(shelf_type),
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
