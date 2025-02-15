"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from "next/image";
import styles from "./page.module.css";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async  () => {
    setLoading(true)

    if (login === "" || senha === ""){
      toast.error("Preencha todos os campos.");
      setLoading(false)
      return
    }

    const data = {
      login: login,
      senha: senha
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json()
        setLoading(false)
        throw new Error(data.detail);
      }

      const result = await response.json();
      console.log(result)
      if (result.detail === 'sucesso'){
        setLoading(false)
        Cookies.set("matricula", result.matricula, { expires: 7, path: "/"})
        Cookies.set("usuario", result.nome, { expires: 7, path: "/"})
        Cookies.set("permissao", result.permissao, { expires: 7, path: "/"})
        router.push('/estoque')
      }
      
    } catch (error) {
      toast.error(error.message);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
                className={styles.inputField}
            />
          </div>
          <button onClick={handleLogin} disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
}
