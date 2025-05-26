import LogoutButton from "./buttons/logout";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div>
        <Link href="/">Home</Link>
        <Link href="/">Monthly Stats</Link>
        <Link href="/">Yearly Stats</Link>
      </div>
      <LogoutButton />
    </nav>
  );
}
