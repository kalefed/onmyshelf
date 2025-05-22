import Link from "next/link";
import styles from "./CurrentlyReading.module.css";
import CurrentlyReadingBooks from "./Books";

export default async function CurrentlyReading() {
  return (
    <div className={styles["currently-reading__container"]}>
      <h2>Currently Reading</h2>
      <div className={styles["currently-reading__books"]}>
        <CurrentlyReadingBooks />
        <button>
          <Link href="/?showModal=true">Add a book</Link>
        </button>
      </div>
    </div>
  );
}
