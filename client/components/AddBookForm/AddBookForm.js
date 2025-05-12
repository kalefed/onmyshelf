import styles from "./AddBookForm.module.css";

export default function AddBookForm() {
  return (
    <form className={styles["book-form"]}>
      <h1>Add a new book</h1>
      <div className={styles["book-form__group"]}>
        <label className={styles["book-form__label"]} htmlFor="title">
          Title
        </label>
        <input
          className={styles["book-form__input"]}
          type="text"
          id="title"
          name="title"
        />
        <p className={styles["book-form__placeholder"]}>Jade City</p>
      </div>
      <div className={styles["book-form__group"]}>
        <label className={styles["book-form__label"]} htmlFor="author">
          Author
        </label>
        <input
          className={styles["book-form__input"]}
          type="text"
          id="author"
          name="author"
        ></input>
        <p className={styles["book-form__placeholder"]}>Fonda Lee</p>
      </div>
      <button>Add Book</button>
    </form>
  );
}
