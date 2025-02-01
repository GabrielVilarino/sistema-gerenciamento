import Image from "next/image";
import styles from "../styles/relatorios.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"

export default function Relatorio() {
  
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <div className={styles.conteudo}>
            <p>Relatórios</p>
          </div>
        </main>
      </div>
    );
  }
  