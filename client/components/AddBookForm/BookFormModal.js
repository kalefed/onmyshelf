import AddBookForm from "./AddBookForm";
import Link from "next/link";

export default function BookFormModal() {
  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border border-gray-200 w-96 shadow-lg rounded-md bg-white">
        <AddBookForm />
        <Link href="/">Close</Link>
      </div>
    </div>
  );
}
