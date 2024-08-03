import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "../styles/globals.scss";
import Header from "../components/Header";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const noHeaderRoutes = ["/", "/login", "/signup"];

  const shouldRenderHeader = !noHeaderRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {shouldRenderHeader && <Header />}
      <Component {...pageProps} />
      <ToastContainer autoClose={2500} />
    </AuthProvider>
  );
}
