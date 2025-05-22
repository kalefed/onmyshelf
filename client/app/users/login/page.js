import styles from "./loginForm.module.css";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className={styles["container"]}>
      <div className={styles["login-form-container"]}>
        <LoginForm />
      </div>
    </div>
  );
}
