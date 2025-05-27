import Link from "next/link";
import CurrentlyReadingBooks from "./Books";

export default async function CurrentlyReading() {
  return (
    <div>
      <div className="flex flex-row items-center gap-x-8 p-1 overflow-x-scroll">
        <CurrentlyReadingBooks />
        <button className="bg-dark-green hover:bg-light-green rounded-full p-2 h-fit">
          <Link href="/?showModal=true">add</Link>
        </button>
      </div>
    </div>
  );
}
