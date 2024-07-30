import Head from "next/head";
import Image from "next/image";
import logoImg from "../../../public/LogoG.svg";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import styles from "./styles.module.scss";

import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    if (email === "" || password === "" || name === "") {
      toast.error(`Preencha todos os dados`, {
        position: "top-center",
        hideProgressBar: true,
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
      const data = { name, password, email };
      await signUp(data);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sal&Brasa | Faça seu Cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Brasa&Sal"></Image>
        <div className={styles.Login}>
          <h1>Criando sua Conta!</h1>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Insira seu e-mail"
              type="email"
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
            Já possui uma conta?
            <Link href="/">Faça o login!</Link>
          </h3>
        </div>
      </div>
    </>
  );
}
