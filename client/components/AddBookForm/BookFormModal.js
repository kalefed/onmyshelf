import AddBookForm from "./AddBookForm";
import Link from "next/link";

export default function BookFormModal() {
  return (
    <div>
      <div>
        <AddBookForm />
        <Link href="/">Close</Link>
      </div>
    </div>
  );
}
