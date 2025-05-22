import styles from "./Page.module.css";
import CurrentlyReading from "../components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "../components/ToBeRead/ToBeRead";
import BookFormModal from "../components/AddBookForm/BookFormModal";
import LogoutButton from "@/components/buttons/logout";
import UpNext from "@/components/UpNext/UpNext";
import WantToRead from "@/components/WantToRead/WantToRead";

export default async function Home({ searchParams }) {
  const { showModal } = await searchParams;

  return (
    <div>
      <LogoutButton />
      <h1 className={styles["heading"]}>Welcome back, Kaleigh</h1>
      <div className={styles["home"]}>
        <div className={styles["placeholder"]}>
          <h2>Reading Challenge</h2>
        </div>
        <div className={`${styles.placeholder} ${styles.placeholderStreaks}`}>
          <h2>Reading Streaks</h2>
        </div>
        <div className={styles["placeholder"]}>
          <h2>Other</h2>
        </div>
        <div className={styles["home_currently-reading"]}>
          <CurrentlyReading />
        </div>
        <div className={styles["placeholder_1"]}>
          <h2>Reading Stats</h2>
        </div>
        <div className={styles["home_want-to-read"]}>
          <WantToRead />
        </div>
        <div className={styles["home_up-next"]}>
          <UpNext />
        </div>
      </div>
      {showModal && <BookFormModal />}
    </div>
  );
}
