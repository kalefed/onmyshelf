"use client";

import { getBook } from "@/services/books";
import { useQuery } from "@tanstack/react-query";

export default function Book({ shelf_type, book_id }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books", shelf_type, book_id],
    queryFn: () => getBook({ shelf_type, id: book_id }),
  });

  // Add loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  return <div>Book: {data.title}</div>;
}
