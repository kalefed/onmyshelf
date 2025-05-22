import Link from "next/link";
import styles from "./UpNext.module.css";

export default async function UpNext() {
  return (
    <div className={styles["up-next__container"]}>
      <h3>Up Next</h3>
      <div className={styles["up-next__books"]}>
        {/* <button>
          <Link href="/?showModal=true">Add a book</Link>
        </button> */}
      </div>
    </div>
  );
}
