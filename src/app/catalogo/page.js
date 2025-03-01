"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/catalogo.module.css";
import Header from "../components/headerCatalogo"
import ProdutoContainer from "../components/produtoContainer"

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);

  const fetchProdutos = async () => {
    try {

      const filtros = {}

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      setProdutos([])
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao carregar a lista de produtos:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.iconeWhats}>
          <a
            href="https://wa.me/5599984052227?text=Tenho interesse em realizar a compra de um produto!" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image
              src="/whats2.png"
              width={50}
              height={50}
              alt="Imagem Whatsapp"
              className={styles.icon}
            />
          </a>
        </div>
        <div className={styles.iconeInsta}>
          <a
            href="https://www.instagram.com/lojinhatemplaria/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image
              src="/instagram2.png"
              width={50}
              height={50}
              alt="Imagem Instagram"
              className={styles.icon}
            />
          </a>
        </div>
        <div className={styles.container}>
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <ProdutoContainer
                key={produto.codigo}
                urlImage={produto.image_url}
                nomeProduto={produto.nome}
                priceSocio={produto.preco_socio}
                priceNaoSocio={produto.preco}
                tamanho={produto.tamanho}
                disponivel={true ? produto.quantidade > 0 : false}
              />
            ))
          ) : (
            <p>Não há produtos disponíveis.</p>
          )}
        </div>
      </main>
    </div>
  );
}
  