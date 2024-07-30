import Head from "next/head";
import Image from "next/image";
import logoImg from "../../public/LogoG.svg";
import { Input, TextArea } from "../components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import styles from "../styles/home.module.scss";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "@/utils/canSSRGuest";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);
  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      toast.error(`Preencha todos os dados`, {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    try {
      const data = { email, password };
      await signIn(data);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Head>
        <title>Sal&Brasa | Faça seu Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Brasa&Sal"></Image>
        <div className={styles.Login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Insira seu e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Insira sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" Loading={loading}>
              Acessar
            </Button>
          </form>
          <h3 className={styles.text}>
            Não possui uma conta?
            <Link href="/signup">Cadastre-se.</Link>
          </h3>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
