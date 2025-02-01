import Image from "next/image";
import styles from "../styles/home.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"

export default function Home() {
  
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <div className={styles.conteudo}>
            <p>Estoque de Produtos</p>
          </div>
        </main>
      </div>
    );
  }
  