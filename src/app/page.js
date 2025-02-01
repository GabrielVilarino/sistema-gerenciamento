"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (login === "admin" && senha === "1234") {
      router.push("/estoque");
    } else {
      toast.error("Login ou senha incorretos!");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.container}>
          <div className={styles.imageLogo}>
            <Image 
              src="/logo.png"
              width={180}
              height={100}
              alt='Logo Templária'
              className={styles.logo}
            />
          </div>
          <p>Sistema de Gestão<br />A.A.A.M.C.I. Templária</p>
          <div className={styles.inputContainer}>
            <Image 
              src="/user.png"
              width={15}
              height={10}
              alt="Ícone Usuário"
              className={styles.icon}
            />
            <input
                type="text"
                placeholder="Usuário"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <Image 
              src="/pass.png"
              width={15}
              height={10}
              alt="Ícone Senha"
              className={styles.icon}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={styles.inputField}
            />
          </div>
          <button onClick={handleLogin}>Entrar</button>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
}
