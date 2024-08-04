import { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./styles.module.scss";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

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

type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: ProductProps;
};

interface ModalAddItemsProps {
  isOpen: boolean;
  onRequestClose: () => void;
  orderId: string;
  handleOpenOrder: (id: string) => void;
}

export function ModalAddItems({
  isOpen,
  onRequestClose,
  orderId,
  handleOpenOrder,
}: ModalAddItemsProps) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItemProps[]>([]);
  const [localItems, setLocalItems] = useState<OrderItemProps[]>([]);

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

  useEffect(() => {
    async function loadOrderItems() {
      const apiClient = setupAPIClient();
      try {
        const response = await apiClient.get("/order/detail", {
          params: { order_id: orderId },
        });
        console.log("Order Items Response:", response.data.items);
        setOrderItems(response.data.items || []);
      } catch (error) {
        console.error("Error loading order items:", error);
        toast.error("Erro ao carregar itens do pedido.");
      }
    }

    if (orderId) {
      loadOrderItems();
    }
  }, [orderId]);

  async function handleAddItem() {
    if (selectedProduct === "" || amount <= 0) {
      toast.error("Selecione um produto e a quantidade correta");
      return;
    }

    // Adiciona o item localmente sem enviar para o servidor
    const product = products.find((product) => product.id === selectedProduct);
    const newItem: OrderItemProps = {
      id: `${selectedProduct}-${Date.now()}`,
      amount,
      order_id: orderId,
      product_id: selectedProduct,
      product: product!,
    };

    setLocalItems((prevItems) => [...prevItems, newItem]);
    toast.success("Produto adicionado ao pedido localmente");
  }

  async function handleSubmitOrder() {
    const apiClient = setupAPIClient();

    for (const item of localItems) {
      await apiClient.post("/order/add", {
        order_id: orderId,
        product_id: item.product_id,
        amount: item.amount,
      });
    }

    toast.success("Pedido enviado com sucesso");
    handleOpenOrder(orderId);
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
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ background: "transparent", border: 0 }}
        >
          <FiX size={45} color="#f34748" />
        </button>
        <h2>Adicionar itens ao pedido</h2>

        <select
          className={styles.selectField}
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
          className={styles.selectField}
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
          className={styles.inputField}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Quantidade"
        />

        <button className={styles.buttonAdd} onClick={handleAddItem}>
          Adicionar Item
        </button>

        <h2>Itens do Pedido</h2>
        {orderItems.length > 0 ? (
          orderItems.map((item) => (
            <section key={item.id} className={styles.containerItem}>
              <span>
                {item.amount} - <strong>{item.product.name}</strong>
              </span>
              <span className={styles.description}>
                {item.product.description}
              </span>
            </section>
          ))
        ) : (
          <p>Nenhum item no pedido.</p>
        )}

        {localItems.length > 0 && (
          <>
            <h2>Itens Locais Adicionados</h2>
            {localItems.map((item) => (
              <section key={item.id} className={styles.containerItem}>
                <span>
                  {item.amount} - <strong>{item.product.name}</strong>
                </span>
                <span className={styles.description}>
                  {item.product.description}
                </span>
              </section>
            ))}
          </>
        )}

        <button className={styles.buttonAdd} onClick={handleSubmitOrder}>
          Enviar Pedido
        </button>
      </div>
    </Modal>
  );
}
