"use client";
import React from "react";
import Image from "next/image";
import styles from "../styles/produtoContainer.module.css";

const ProdutoContainer = ({ urlImage, nomeProduto, priceSocio, priceNaoSocio, tamanho, disponivel }) => {
  return (
    <div className={styles.container}>
      <Image
        src={urlImage}
        width={100}
        height={100}
        alt={nomeProduto}
        className={styles.imageProduto}
      />

      <h2>{nomeProduto} - {tamanho}</h2>

      <div className={styles.precos}>
        <p>
          <strong>Sócio</strong> R$ {priceSocio}
        </p>
        <p>
          <strong>Não Sócio</strong> R$ {priceNaoSocio}
        </p>
      </div>

      {/* Botão Comprar */}
      <a
        href={`https://wa.me/5599991652385?text=Olá, tenho interesse no produto ${nomeProduto} no tamanho ${tamanho}.`}
        target="_blank" 
        rel="noopener noreferrer"
        className={`${styles.btnComprar} ${!disponivel ? styles.disabled : ""}`}
        onClick={(e) => {
          if (!disponivel) {
            e.preventDefault(); // Evita a navegação se o produto não estiver disponível
          }
        }}
        style={{ pointerEvents: disponivel ? "auto" : "none",
          opacity: disponivel ? 1 : 0.5,
          backgroundColor: disponivel ? "#15741F" : "#B7262A" }}
      >
        {disponivel ? "Comprar" : "Indiponível"}
      </a>
    </div>
  );
};

export default ProdutoContainer;
