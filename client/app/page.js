import styles from "./Page.module.css";
import CurrentlyReading from "../components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "../components/ToBeRead/ToBeRead";
import BookFormModal from "../components/AddBookForm/BookFormModal";

export default async function Home({ searchParams }) {
  const { showModal } = await searchParams;

  return (
    <div>
      <h1>Home Page</h1>
      <div className={styles["home"]}>
        <CurrentlyReading />
        <h2>Reading Streak</h2>
        {/* <ToBeRead /> */}
        <h2>Monthly Reading Stats</h2>
      </div>
      {showModal && <BookFormModal />}
    </div>
  );
}
