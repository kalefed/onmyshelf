"use client";

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
