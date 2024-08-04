import { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./styles.module.scss";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

type CategoryProps = {
  id: string;
  name: string;
};

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: string;
};

interface ModalEditItemProps {
  isOpen: boolean;
  onRequestClose: () => void;
  orderId: string;
  handleUpdate: () => void;
}

export function ModalEditItem({
  isOpen,
  onRequestClose,
  orderId,
  handleUpdate,
}: ModalEditItemProps) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    async function loadCategories() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/catlist");
      setCategories(response.data);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (selectedCategory === "") return;
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/list/product", {
        params: { category_id: selectedCategory },
      });
      setProducts(response.data);
    }

    loadProducts();
  }, [selectedCategory]);

  async function handleAddItem() {
    if (selectedProduct === "" || amount <= 0) {
      toast.error("Selecione um produto e a quantidade correta");
      return;
    }

    const apiClient = setupAPIClient();
    await apiClient.post("/order/add", {
      order_id: orderId,
      product_id: selectedProduct,
      amount: amount,
    });

    toast.success("Produto adicionado ao pedido");
    handleUpdate();
    onRequestClose();
  }

  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className={styles.container}>
        <h2>Adicionar item</h2>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Quantidade"
        />

        <button className={styles.buttonAdd} onClick={handleAddItem}>
          Adicionar
        </button>
      </div>
    </Modal>
  );
}
