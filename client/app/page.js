import styles from "./Page.module.css";
import CurrentlyReading from "../components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "../components/ToBeRead/ToBeRead";
import BookFormModal from "../components/AddBookForm/BookFormModal";
import UpNext from "@/components/UpNext/UpNext";
import WantToRead from "@/components/WantToRead/WantToRead";

export default async function Home({ searchParams }) {
  const { showModal } = await searchParams;

  return (
    <div>
      <h1>Welcome back, Kaleigh</h1>
      <div>
        <div>
          <h3>Reading Challenge</h3>
        </div>
        <div>
          <h3>Reading Streaks</h3>
        </div>
        <div>
          <h3>Other</h3>
        </div>
        <div>
          <CurrentlyReading />
        </div>
        <div>
          <h3>Reading Stats</h3>
        </div>
        <div>
          <WantToRead />
        </div>
        <div>
          <UpNext />
        </div>
      </div>
      {showModal && <BookFormModal />}
    </div>
  );
}
