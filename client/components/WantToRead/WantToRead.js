import Link from "next/link";
import styles from "./WantToRead.module.css";

export default async function WantToRead() {
  return (
    <div className={styles["want-to-read__container"]}>
      <h2>Want to read</h2>
      <div className={styles["want-to-read__books"]}>
        {/* <button>
          <Link href="/?showModal=true">Add a book</Link>
        </button> */}
      </div>
    </div>
  );
}
