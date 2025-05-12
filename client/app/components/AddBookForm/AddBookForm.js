"use client";

import styles from "./AddBookForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function AddBookForm() {
  const queryClient = useQueryClient();

  // Function to add a book using an API call
  const addBook = async (formData) => {
    const newBook = {
      title: formData.get("title"),
      author: formData.get("author"),
    };

    // Send the data to the API
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/books`,
        newBook
      );
      console.log("POST SUCCESS", res.data);
      return res;
    } catch (err) {
      console.error("POST ERROR", err.response?.data || err.message);
      throw err;
    }
  };

  // Mutations
  const mutation = useMutation({
    mutationFn: addBook,
    onSuccess: (data) => {
      setMessage("Book added successfully!");
      console.log("Mutation success — invalidating books query");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      setMessage("Failed to add book. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the form data
    const formData = new FormData(e.target);

    // Call the mutation's mutate function to trigger the request
    mutation.mutate(formData);

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
        ></input>
        <p className={styles["book-form__placeholder"]}>Fonda Lee</p>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}
