import { ButtonHTMLAttributes, ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";
import styles from "./styles.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Loading?: boolean;
  children: ReactNode;
}

export function Button({ Loading, children, ...rest }: ButtonProps) {
  return (
    <button className={styles.button} disabled={Loading} {...rest}>
      {Loading ? (
        <FaSpinner className={styles.spinner} />
      ) : (
        <a className={styles.buttoText}>{children}</a>
      )}
    </button>
  );
}
