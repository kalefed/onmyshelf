import RegisterForm from "./registerForm";
import styles from "./registerForm.module.css";

export default function LogoutPage() {
  return (
    <div className={styles["container"]}>
      <div className={styles["login-form-container"]}>
        <RegisterForm />
      </div>
    </div>
  );
}
