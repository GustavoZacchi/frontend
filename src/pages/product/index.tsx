import { ChangeEvent, FormEvent, useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";
import styles from "./styles.module.sass";
import Head from "next/head";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
};
interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Produt({ categoryList }: CategoryProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);
  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorieSelected] = useState(0);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      if (
        name === "" ||
        price === "" ||
        description === "" ||
        avatarUrl === ""
      ) {
        toast.error("Preencha todos os dados");
        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);

      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);
      console.log(data);
      const apiClient = setupAPIClient();
      await apiClient.post("./product", data);

      toast("Produto Cadastrado");
    } catch (err) {
      console.log(err);
      toast.error("erro ao enviar");
    }
    setName("");
    setAvatarUrl("");
    setCategories[0];
    setPrice("");
    setImageAvatar(null);
    setDescription("");
  }
  function handleChangeCategory(e) {
    setCategorieSelected(e.target.value);
  }

  function handleFIle(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const image = e.target.files[0];

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }
  return (
    <>
      <Head>
        <title>Sal&Brasa | Novo Produto</title>
      </Head>
      <main className={styles.container}>
        <h1>Novo Produto</h1>
        <form action="submit" className={styles.form} onSubmit={handleRegister}>
          <label className={styles.labelAvatar}>
            <span>
              <FiUpload></FiUpload>
            </span>
            <input
              type="file"
              accept="image/png, image/png"
              onChange={handleFIle}
            />
            {avatarUrl && (
              <img
                className={styles.preview}
                src={avatarUrl}
                alt="Foto do Produto"
                width={250}
                height={250}
              />
            )}
          </label>
          <select value={categorySelected} onChange={handleChangeCategory}>
            {categories.map((item, index) => (
              <option key={item.id} value={index}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o Nome do produto"
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
            placeholder="Digite o preço do produto"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            placeholder="Descreva o Produto..."
          ></textarea>
          <button className={styles.buttonAdd} type="submit">
            Cadastrar
          </button>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/catlist");

  return {
    props: { categoryList: response.data },
  };
});
