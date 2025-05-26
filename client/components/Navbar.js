import LogoutButton from "./buttons/logout";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between mx-4">
      <ul className="flex gap-x-4 list-none p-0 m-0">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/">Monthly Stats</Link>
        </li>
        <li>
          <Link href="/">Yearly Stats</Link>
        </li>
      </ul>
      <LogoutButton />
    </nav>
  );
}
