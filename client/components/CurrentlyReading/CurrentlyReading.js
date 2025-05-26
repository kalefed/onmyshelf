import Link from "next/link";
import CurrentlyReadingBooks from "./Books";

export default async function CurrentlyReading() {
  return (
    <div>
      <div>
        <CurrentlyReadingBooks />
        <button>
          <Link href="/?showModal=true">Add a book</Link>
        </button>
      </div>
    </div>
  );
}
