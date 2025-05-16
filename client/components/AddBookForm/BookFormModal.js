import styles from "./BookFormModal.module.css";
import AddBookForm from "./AddBookForm";
import Link from "next/link";

export default function BookFormModal() {
  return (
    <div className={styles["book-form-modal"]}>
      <div className={styles["book-form-modal__content"]}>
        <AddBookForm />
        <Link href="/">Close</Link>
      </div>
    </div>
  );
}
