import Head from "next/head";
import Image from "next/image";
import logoImg from "../../public/LogoG.svg";
import { Input, TextArea } from "../components/ui/Input";
import { Button } from "@/components/ui/Button";

import styles from "../styles/home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sal&Brasa | Faça seu Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Brasa&Sal"></Image>
        <div className={styles.Login}>
          <form action="">
            <Input placeholder="Insira seu e-mail" type="text" />
            <Input placeholder="Insira sua senha" type="password" />
            <Button type="submit" Loading={false}>
              Acessar
            </Button>
          </form>
          <a className={styles.text}>Não possui uma conta? Cadastre-se.</a>
        </div>
      </div>
    </>
  );
}
