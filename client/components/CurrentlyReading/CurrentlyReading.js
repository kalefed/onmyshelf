import Link from "next/link";
import styles from "./CurrentlyReading.module.css";
import BookFormModal from "../AddBookForm/BookFormModal";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getBooksOnShelf } from "@/services/books";
import CurrentlyReadingBooks from "./Books";

export default async function CurrentlyReading() {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["books"],
  //   queryFn: getBooksOnShelf,
  // });

  return (
    <div>
      <h2>Currently Reading</h2>
      <div className={styles["currently-reading__books"]}>
        {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
        <CurrentlyReadingBooks />
        {/* </HydrationBoundary> */}
        <button>
          <Link href="/?showModal=true">Add a book</Link>
        </button>
      </div>
    </div>
  );
}
