"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooksOnShelf } from "@/services/books";
import Link from "next/link";

export default function BookList({ shelf_type }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books", shelf_type],
    queryFn: () => getBooksOnShelf(shelf_type),
  });

  // Add loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="flex flex-row gap-x-8">
      {data.map((book) => (
        <Link href={`/books/${shelf_type}/${book.id}`} key={book.id}>
          <li key={book.id}>
            <div className="outline-1 pl-4 outline-gray-300 rounded-md h-45 w-35 mb-2"></div>
            <strong className="block text-sm/6">{book.title}</strong>
            <p className="block text-sm/6">{book.author}</p>
            <p className="block text-sm/6 text-gray-500">25%</p>
          </li>
        </Link>
      ))}
    </ul>
  );
}
