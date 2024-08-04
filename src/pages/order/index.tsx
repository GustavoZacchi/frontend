import { FormEvent, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.sass";
import Head from "next/head";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

export default function Produt() {
  const [name, setName] = useState("");
  const [table, setTable] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      if (name === "" || table === "") {
        toast.error("Preencha todos os dados");
        return;
      }

      const apiClient = setupAPIClient();
      await apiClient.post("/order", {
        name: name,
        table: Number(table),
      });

      toast.success("Mesa Cadastrada");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar");
    }

    setName("");
    setTable("");
  }

  return (
    <>
      <Head>
        <title>Sal&Brasa | Novo pedido</title>
      </Head>
      <main className={styles.container}>
        <h1>Novo pedido</h1>
        <form className={styles.form} onSubmit={handleRegister}>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o Nome do cliente"
          />
          <input
            type="text"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className={styles.input}
            placeholder="Digite o Número da mesa"
          />
          <button className={styles.buttonAdd} type="submit">
            Abrir Mesa
          </button>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
