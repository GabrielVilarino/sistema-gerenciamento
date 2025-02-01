import Image from "next/image";
import styles from "../styles/vendas.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"

export default function Vendas() {
  
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <div className={styles.conteudo}>
            <p>Vendas</p>
          </div>
        </main>
      </div>
    );
  }
  