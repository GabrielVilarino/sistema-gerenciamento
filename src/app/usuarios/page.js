import Image from "next/image";
import styles from "../styles/usuarios.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"

export default function Usuarios() {
  
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <div className={styles.conteudo}>
            <p>Usuários</p>
          </div>
        </main>
      </div>
    );
  }
  