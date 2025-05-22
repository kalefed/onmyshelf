"use client";

import styles from "./registerForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { userRegister } from "@/services/users";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  // Mutations to register a user
  const mutation = useMutation({
    mutationFn: userRegister,
    onSuccess: async () => {
      router.push("/users/login"); // route the user to login page
    },
    onError: () => {
      setMessage("Failed to register. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the mutation's mutate function to trigger the request
    mutation.mutate(new FormData(e.target));
  };

  return (
    <form className={styles["register-form"]} onSubmit={handleSubmit}>
      <div className={styles["register-form__group"]}>
        <label htmlFor="email" className={styles["register-form__label"]}>
          Email address
        </label>
        <input
          className={styles["register-form__input"]}
          id="email"
          type="email"
          name="email"
          required
        />
      </div>
      <div className={styles["register-form__group"]}>
        <label htmlFor="username" className={styles["register-form__label"]}>
          Username
        </label>
        <input
          className={styles["register-form__input"]}
          id="username"
          type="text"
          name="username"
          required
        />
      </div>
      <div className={styles["register-form__group"]}>
        <label htmlFor="password" className={styles["register-form__label"]}>
          Password
        </label>
        <input
          className={styles["register-form__input"]}
          id="password"
          type="password"
          name="password"
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
