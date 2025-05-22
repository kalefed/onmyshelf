"use client";

import styles from "./loginForm.module.css";
import { useMutation } from "@tanstack/react-query";
import { userLogin } from "@/services/users";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  // Mutations to log a user in
  const mutation = useMutation({
    mutationFn: userLogin,
    onSuccess: async () => {
      router.push("/"); // route the user to home page
    },
    onError: () => {
      setMessage("Failed to login. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the mutation's mutate function to trigger the request
    mutation.mutate(new FormData(e.target));
  };

  return (
    <div>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <div className={styles["login-form__group"]}>
          <label htmlFor="username" className={styles["login-form__label"]}>
            Username
          </label>
          <input
            className={styles["login-form__input"]}
            id="username"
            type="text"
            name="username"
            required
          />
        </div>
        <div className={styles["login-form__group"]}>
          <label htmlFor="password" className={styles["login-form__label"]}>
            Password
          </label>
          <input
            className={styles["login-form__input"]}
            id="password"
            type="password"
            name="password"
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <Link href="/users/register">Register instead</Link>
    </div>
  );
}
