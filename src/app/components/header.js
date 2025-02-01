"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/header.module.css';
import Image from "next/image";
import Cookies from "js-cookie";

const Header = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    if (path === '/'){
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    }
    router.push(path);
  };

  return (
    <aside className={styles.header}>
        <div className={styles.container}>
            <div className={styles.headerLogo}>
                <div>
                  <a 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/');
                      }}
                  >
                    <Image 
                    src="/logo.png"
                    width={100}
                    height={100}
                    alt='Logo Templária'
                    className={styles.logo}
                    />
                  </a>
                </div>
                <div>
                    <p>Sistema de Gestão<br />A.A.A.M.C.I. Templária</p>
                </div>
            </div>
            <div className={styles.user}>
                <p>Olá, Nome do Usuário</p>
                <div>
                    <Image 
                    src="/userHeader.png"
                    width={30}
                    height={20}
                    alt='Imagem Usuário'
                    className={styles.logoUser}
                    />
                </div>
            </div>
        </div>
    </aside>
  );
};

export default Header;
