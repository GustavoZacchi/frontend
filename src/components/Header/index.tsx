import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import Logo from "../../../public/LogoS.svg";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "@/contexts/AuthContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Header() {
  const { signOut } = useContext(AuthContext);
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <Image src={Logo} alt="Logo Brasa&Sal" width={190} height={60} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/order" legacyBehavior>
            <a>Abrir pedido</a>
          </Link>
          <Link href="/product" legacyBehavior>
            <a>Cardapio</a>
          </Link>
          <Link href="/category" legacyBehavior>
            <a>Categoria</a>
          </Link>
          <Link href="/editorder" legacyBehavior>
            <a>Editar pedido</a>
          </Link>
          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
