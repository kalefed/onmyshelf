"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooksOnShelf } from "@/services/books";
import Link from "next/link";
import Image from "next/image";

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
            <div className="outline-1 outline-gray-300 rounded-md mb-2 w-[175px] h-[275px]">
              <Image
                src={book.cover_image || "/plain.jpg"}
                width={200}
                height={300}
                alt={`Cover of ${book.title}`}
                className="object-fill rounded-md w-full h-full"
              />
            </div>

            <strong className="block text-sm/6">{book.title}</strong>
            <p className="block text-sm/6">{book.author}</p>
            <p className="block text-sm/6 text-gray-500">25%</p>
          </li>
        </Link>
      ))}
    </ul>
  );
}
