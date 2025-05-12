import styles from "./Page.module.css";
import CurrentlyReading from "./components/CurrentlyReading/CurrentlyReading";
import ToBeRead from "./components/ToBeRead/ToBeRead";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <div className={styles["home"]}>
        <CurrentlyReading />
        <h2>Reading Streak</h2>
        <ToBeRead />
        <h2>Monthly Reading Stats</h2>
      </div>
    </div>
  );
}
