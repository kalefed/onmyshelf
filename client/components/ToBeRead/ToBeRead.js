import styles from "./ToBeRead.module.css";

export default function ToBeRead() {
  return (
    <div>
      <h2>To Be Read</h2>
      <div className={styles["to-be-read__books"]}>empty</div>
    </div>
  );
}
