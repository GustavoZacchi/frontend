import { useState } from "react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { ModalAddItems } from "@/components/ModalAddItems";
import { FiRefreshCcw } from "react-icons/fi";

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  };
};

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

interface HomeProps {
  orders: OrderProps[];
}

export default function EditOrder({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);
  const [modalOrder, setModalOrder] = useState<OrderItemProps[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/detail", {
      params: {
        order_id: id,
      },
    });

    setModalOrder(response.data);
    setModalVisible(true);
  }

  async function handleOpenOrder(id: string) {
    const apiClient = setupAPIClient();
    await apiClient.put("/order/update", {
      order_id: id,
    });

    const response = await apiClient.get("/orders");
    setOrderList(response.data);
    setModalVisible(false);
  }

  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();
    const [draftOrdersResponse, allOrdersResponse] = await Promise.all([
      apiClient.get("/orders/draft"),
      apiClient.get("/orders"),
    ]);

    const combinedOrders = [
      ...draftOrdersResponse.data,
      ...allOrdersResponse.data,
    ];

    setOrderList(combinedOrders);
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Sal&Brasa | Painel</title>
      </Head>
      <div>
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos pedidos</h1>
            <button onClick={handleRefreshOrders}>
              <FiRefreshCcw size={25} color="#3fffa3" />
            </button>
          </div>

          <article className={styles.listOreders}>
            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

            {orderList.map((item) => (
              <section
                key={item.id}
                className={`${styles.orderItem} ${
                  item.draft ? styles.draft : ""
                }`}
              >
                <button onClick={() => handleOpenModalView(item.id)}>
                  <div className={styles.tag}></div>
                  <span>
                    Mesa {item.table} | Cliente {item.name}
                  </span>
                  <span></span>
                </button>
              </section>
            ))}
          </article>
        </main>

        {modalVisible && modalOrder && (
          <ModalAddItems
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalOrder}
            handleOpenOrder={handleOpenOrder}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const [draftOrdersResponse, allOrdersResponse] = await Promise.all([
    apiClient.get("/orders/draft"),
    apiClient.get("/orders"),
  ]);

  const combinedOrders = [
    ...draftOrdersResponse.data,
    ...allOrdersResponse.data,
  ];

  return {
    props: {
      orders: combinedOrders,
    },
  };
});
