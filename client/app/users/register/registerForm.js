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
    <section className="mt-10">
      <form onSubmit={handleSubmit}>
        <fieldset className="grid grid-cols-1 gap-y-8">
          <legend className="sr-only">Register form</legend>
          <div>
            <label className="block text-sm/6 font-medium" htmlFor="email">
              Email address
            </label>
            <input
              className="mt-2 rounded-md outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-dark-orange px-3 py-1.5 w-full"
              id="email"
              type="email"
              name="email"
              required
            />
          </div>
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
          <button
            className="bg-dark-orange rounded-xl px-4 py-2 hover:bg-light-orange text-sm w-fit"
            type="submit"
          >
            Register
          </button>
        </fieldset>
      </form>
    </section>
  );
}
