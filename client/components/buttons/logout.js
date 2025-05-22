"use client";
import { userLogout } from "@/services/users";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  // Mutations to log a user in
  const mutation = useMutation({
    mutationFn: userLogout,
    onSuccess: async () => {
      router.push("/users/login"); // route the user to login page
    },
    onError: () => {
      setMessage("Failed to logout. Please try again.");
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
