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

  return (
    <div className="grid grid-cols-2 mt-10 mx-4">
      <div>
        <header>
          <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
          <p>{data.author}</p>
        </header>
        <section>
          <p>The book description</p>
        </section>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Info</h3>
      </div>
    </div>
  );
}
