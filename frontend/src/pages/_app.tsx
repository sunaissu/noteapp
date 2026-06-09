import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar";
import React, { useEffect } from "react";
import { User } from "../model/user";
import * as NotesApi from "../util/fetch";
import { SpinnerBallIcon } from "@phosphor-icons/react";
import { useRouter } from "next/router";

const PROTECTED_ROUTES = ["/notes", "/shared", "/favorites", "/settings"];
const GUEST_ONLY_ROUTES = ["/login", "/register"];
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        setIsLoading(true);
        const user = await NotesApi.getLoginUser();
        setLoggedInUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!loggedInUser && PROTECTED_ROUTES.includes(router.pathname)) {
      router.push("/unauthorized");
    }
    if (loggedInUser && GUEST_ONLY_ROUTES.includes(router.pathname)) {
      router.push("/");
    }
  }, [loggedInUser, router, router.pathname, isLoading]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await NotesApi.logout();
      setLoggedInUser(null);
      await router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "var(--color-bg)",
          color: "var(--color-text-muted)",
        }}
      >
        <SpinnerBallIcon className="spin" size={48} />
      </div>
    );
  }
  return (
    <div>
      <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
      <Component {...pageProps} loggedInUser={loggedInUser} />
    </div>
  );
}
