import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { canSSRAuth } from "@/utils/canSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <p>Bem vindo, {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Id: {user?.id}</p>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
