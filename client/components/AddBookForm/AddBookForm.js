"use client";

import styles from "./AddBookForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook } from "@/services/books";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
    <form className={styles["book-form"]} onSubmit={handleSubmit}>
      <h2>Add a new book</h2>
      <div className={styles["book-form__group"]}>
        <label className={styles["book-form__label"]} htmlFor="title">
          Title
        </label>
        <input
          className={styles["book-form__input"]}
          type="text"
          id="title"
          name="title"
          required
        />
        <p className={styles["book-form__placeholder"]}>Jade City</p>
      </div>
      <div className={styles["book-form__group"]}>
        <label className={styles["book-form__label"]} htmlFor="author">
          Author
        </label>
        <input
          className={styles["book-form__input"]}
          type="text"
          id="author"
          name="author"
          required
        ></input>
        <p className={styles["book-form__placeholder"]}>Fonda Lee</p>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}
