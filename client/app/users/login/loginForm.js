import styles from "./loginForm.module.css";

export default function LoginForm() {
  return (
    <form className={styles["login-form"]}>
      <div className={styles["login-form__group"]}>
        <label className={styles["login-form__label"]}>Username</label>
        <input
          className={styles["login-form__input"]}
          id="username"
          type="text"
          name="username"
          required
        />
      </div>
      <div className={styles["login-form__group"]}>
        <label className={styles["login-form__label"]}>Password</label>
        <input
          className={styles["login-form__input"]}
          id="password"
          type="password"
          name="password"
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}
