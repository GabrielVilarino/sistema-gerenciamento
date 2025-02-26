"use client"
import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import styles from '../styles/headerCatalogo.module.css';
import Image from "next/image";
import Cookies from "js-cookie";

const HeaderCatalogo = () => {
  const router = useRouter();
  const [nome, setNome] = useState("")

  useEffect(() => {
    setNome(Cookies.get("usuario"))
  }, [])

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
              href="/catalogo"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/catalogo');
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
            <p>Catálogo<br />A.A.A.M.C.I. Templária</p>
          </div>
        </div>
        <div className={styles.links}>
          <div>
            <a href="https://www.instagram.com/aaatemplaria/" target="_blank" rel="noopener noreferrer">
              <Image 
              src="/instagram.png"
              width={40}
              height={20}
              alt='Imagem instagram'
              className={styles.icons}
              />
            </a>
          </div>
          <div>
            <a
              href="https://wa.me/5599984052227?text=Tenho interesse em realizar compra de um produto!" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Image 
              src="/whatsapp.png"
              width={40}
              height={20}
              alt='Imagem whatsapp'
              className={styles.icons}
              />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HeaderCatalogo;
