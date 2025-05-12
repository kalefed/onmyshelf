import styles from "./AddBookForm.module.css";

export default function AddBookForm() {
  return (
    <form className={styles.form}>
      <h1>Add a new book</h1>
      <div className="flex flex-col">
        <label htmlFor="title">Ttitle</label>
        <input type="text" id="title" name="title" />
        <p>Jade City</p>
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          placeholder="Fonda Lee"
        ></input>
      </div>
      <button>Add Book</button>
    </form>
  );
}
