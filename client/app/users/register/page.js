import RegisterForm from "./registerForm";
import Link from "next/link";

export default function LogoutPage() {
  return (
    <main className="flex justify-center mt-20">
      <section className="w-full max-w-md px-4 bg-white rounded-xl py-8">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="flex gap-2 text-sm mt-2">
          Already have an account?
          <Link className="underline text-dark-orange" href="/users/login">
            Log in instead
          </Link>
        </p>
        <RegisterForm />
      </section>
    </main>
  );
}
