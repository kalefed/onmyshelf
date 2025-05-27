"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook } from "@/services/books";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import TagInput from "./tagInput";
import Link from "next/link";

export default function AddBookForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("showModal"); // or set it to false
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Mutations to add a book
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: async () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: () => {
      setMessage("Failed to add book. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the mutation's mutate function to trigger the request
    mutation.mutate(new FormData(e.target));

    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="grid grid-cols-1 gap-y-8">
        <legend className="sr-only">
          Add a new book to currently reading form
        </legend>
        <h1 className="text-2xl font-semibold">Add a new book</h1>
        <div>
          <label className="block text-sm/6 font-medium" htmlFor="title">
            Title
          </label>
          <input
            className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-dark-orange px-3 py-1.5 w-full"
            type="text"
            id="title"
            name="title"
            required
          />
          <p className="text-sm/8 text-gray-500">Jade City</p>
        </div>
        <div>
          <label className="block text-sm/6 font-medium" htmlFor="author">
            Author
          </label>
          <input
            className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-dark-orange px-3 py-1.5 w-full"
            type="text"
            id="author"
            name="author"
            required
          ></input>
          <p className="text-sm/8 text-gray-500">Fonda Lee</p>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm/6 font-medium" htmlFor="format_type">
              Format Type
            </label>
            <select
              className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 w-full  bg-white px-3 py-2 text-sm focus:border-dark-orange focus:outline-none focus:ring-1 focus:ring-dark-orange"
              id="format_type"
              name="format_type"
            >
              <option value="audiobook">Audiobook</option>
              <option value="physical">Physical</option>
              <option value="ebook">Ebook</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm/6 font-medium" htmlFor="purchase_method">
              Purchase Method
            </label>
            <select
              className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 w-full  bg-white px-3 py-2 text-sm focus:border-dark-orange focus:outline-none focus:ring-1 focus:ring-dark-orange"
              id="purchase_method"
              name="purchase_method"
            >
              <option value="library">Library</option>
              <option value="gifted">Gifted</option>
              <option value="bought">Bought</option>
            </select>
          </div>
        </div>
        <TagInput />

        {/* Action buttons (submit or close modal) */}
        <div className="flex flex-row justify-between">
          <button
            className="bg-dark-orange rounded-xl px-4 py-2 hover:bg-light-orange text-sm w-fit"
            type="submit"
          >
            Add Book
          </button>
          <div className="mt-2 hover:underline text-sm/6">
            <Link href="/">Close</Link>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
