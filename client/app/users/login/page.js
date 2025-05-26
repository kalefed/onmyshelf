import LoginForm from "./loginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex justify-center mt-20">
      <section className="w-full max-w-md px-4 bg-white rounded-xl py-8">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="flex gap-2 text-sm mt-2">
          Don't have an account?
          <Link className="underline text-dark-orange" href="/users/register">
            Register instead
          </Link>
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
