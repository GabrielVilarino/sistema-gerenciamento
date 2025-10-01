"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/sideBarMenu.module.css';
import Image from "next/image";
import Cookies from "js-cookie";

const SidebarMenuAdmin = () => {
  const router = useRouter();
  const [permissao, setPermissao] = useState(null);

  const handleNavigation = (path) => {
    if (path === '/'){
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    }
    router.push(path);
  };

  useEffect(() => {
    const permissaoCookie = Cookies.get('permissao');
    setPermissao(permissaoCookie);
  }, []);

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.menu}>
        <div className={styles.link}>
            <div>
                <Image 
                src="/iconeEstoque.png"
                width={20}
                height={15}
                alt='Logo Templária'
                className={styles.icon}
                />
            </div>
            <li onClick={() => handleNavigation('/estoque')} className={styles.menuItem}>
                Estoque de Produtos
            </li>
        </div> {/* Link Container */}
        <div className={styles.link}>
            <div>
                <Image 
                    src="/iconeVendas.png"
                    width={20}
                    height={15}
                    alt='Logo Templária'
                    className={styles.icon}
                />
            </div>
            <li onClick={() => handleNavigation('/vendas')} className={styles.menuItem}>
                Vendas
            </li>
        </div> {/* Link Container */}
        {permissao === "ADMIN" && (
            <>
                <div className={styles.link}>
                    <div>
                        <Image 
                            src="/iconeUsuarios.png"
                            width={20}
                            height={15}
                            alt='Logo Templária'
                            className={styles.icon}
                        />
                    </div>
                    <li onClick={() => handleNavigation('/usuarios')} className={styles.menuItem}>
                        Usuários
                    </li>
                </div> {/* Link Container */}
            </>
        )}
        <div className={styles.link}>
            <div>
                <Image 
                    src="/iconeRelatorios.png"
                    width={20}
                    height={15}
                    alt='Logo Templária'
                    className={styles.icon}
                />
            </div>
            <li onClick={() => handleNavigation('/relatorios')} className={styles.menuItem}>
                Relatórios
            </li>
        </div> {/* Link Container */}
        <div className={`${styles.link} ${styles.sairLink}`}>
            <div>
                <Image 
                    src="/iconeSair.png"
                    width={20}
                    height={15}
                    alt='Logo Templária'
                    className={styles.icon}
                />
            </div>
            <li onClick={() => handleNavigation('/')} className={styles.menuItem}>
                Sair
            </li>
        </div> {/* Link Container */}
      </ul>
    </aside>
  );
};

export default SidebarMenuAdmin;
