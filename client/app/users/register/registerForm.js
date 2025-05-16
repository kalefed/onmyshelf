import styles from "./registerForm.module.css";

export default function RegisterForm() {
  return (
    <form className={styles["register-form"]}>
      <div className={styles["register-form__group"]}>
        <label className={styles["register-form__label"]}>Email address</label>
        <input
          className={styles["register-form__input"]}
          id="email"
          type="email"
          name="email"
          required
        />
      </div>
      <div className={styles["register-form__group"]}>
        <label className={styles["register-form__label"]}>Username</label>
        <input
          className={styles["register-form__input"]}
          id="username"
          type="text"
          name="username"
          required
        />
      </div>
      <div className={styles["register-form__group"]}>
        <label className={styles["register-form__label"]}>Password</label>
        <input
          className={styles["register-form__input"]}
          id="password"
          type="password"
          name="password"
          required
        />
      </div>
      {/* <div className={styles["register-form__group"]}>
        <label className={styles["register-form__label"]}>
          Password confirmation
        </label>
        <input
          className={styles["register-form__input"]}
          id="password_conf"
          type="password"
          name="password_conf"
          required
        />
      </div> */}
      <button type="submit">Register</button>
    </form>
  );
}
