import Link from "next/link";
import styles from "./WantToRead.module.css";
import BookList from "../Books";

export default async function WantToRead() {
  return (
    <div>
      <div className="flex flex-row items-center gap-x-8 p-1 overflow-x-auto">
        <BookList shelf_type="tbr" />
        <button className="bg-dark-green hover:bg-light-green rounded-full p-2 h-fit">
          <Link href="/?showModal=true">add</Link>
        </button>
      </div>
    </div>
  );
}
