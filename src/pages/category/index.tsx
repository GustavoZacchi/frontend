import { FormEvent, useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.sass";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [name, setName] = useState("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (name === "") {
      toast.error("Nome da categoria não pode ser vazio");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/categ", { name: name });
      toast.success("Categoria cadastrada com sucesso");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Categoria Já Cadastrada");
      }
    }
    setName("");
  }

  return (
    <>
      <Head>
        <title>Sal&Brasa | Nova Categoria</title>
      </Head>
      <div>
        <main className={styles.container}>
          <h1>Cadastrar Categoria</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <input
              value={name}
              type="text"
              className={styles.input}
              placeholder="Digite o Nome da Categoria"
              onChange={(e) => setName(e.target.value)}
            />
            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
