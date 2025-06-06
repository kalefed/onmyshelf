"use client";

import { getBook } from "@/services/books";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Book({ shelf_type, book_id }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["books", shelf_type, book_id],
    queryFn: () => getBook({ shelf_type, id: book_id }),
  });

  // Add loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);
  const bookGenre = data.genres;

  return (
    <div className="grid grid-cols-2 mt-10 mx-4 gap-x-8">
      <div>
        <header className="flex flex-row gap-4">
          <Image
            src={
              data.cover_image
                ? `${process.env.NEXT_PUBLIC_SERVER_URL}${data.cover_image}`
                : "/plain.jpg"
            }
            width={200}
            height={200}
            alt={`Cover of ${data.title}`}
            className="object-fill rounded-md mb-4"
            unoptimized
          />
          <section className="flex flex-col">
            <h1 className="text-2xl font-semibold mb-2">{data.title}</h1>
            <p className="text-sm/6">{data.author}</p>
            <p className="text-sm/6">{data.page_count} Pages</p>
          </section>
        </header>
        <section>
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-sm/6">{data.description}</p>
          <ul className="mt-4 bg-light-green rounded-2xl w-fit px-4 py-1 ">
            {bookGenre.map((genre) => (
              <li key={genre}>
                <p className="text-sm/6">{genre}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Info</h3>
        <div className="border-1 rounded-xl p-2 h-full"></div>
      </div>
    </div>
  );
}
