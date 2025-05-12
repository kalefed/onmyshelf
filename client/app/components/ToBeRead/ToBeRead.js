import styles from "./ToBeRead.module.css";

export default function ToBeRead() {
  return (
    <div>
      <h1>To Be Read</h1>
      <div className={styles["to-be-read__books"]}>empty</div>
    </div>
  );
}
