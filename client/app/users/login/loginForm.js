"use client";

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
    <section className="mt-10">
      <form onSubmit={handleSubmit}>
        <fieldset className="grid grid-cols-1 gap-y-8">
          <legend className="sr-only">Login form</legend>
          <div>
            <label className="block text-sm/6 font-medium" htmlFor="username">
              Username
            </label>
            <input
              className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-dark-orange px-3 py-1.5 w-full"
              id="username"
              type="text"
              name="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm/6 font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-dark-orange px-3 py-1.5 w-full"
              id="password"
              type="password"
              name="password"
              required
            />
          </div>
          <div className="flex">
            <button
              className="bg-dark-orange rounded-xl px-4 py-2 hover:bg-light-orange text-sm w-fit"
              type="submit"
            >
              Log In
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
