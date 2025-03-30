"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "../styles/home.module.css";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import ConfirmModal from "../components/confirmModal";
import InputProdutoModal from "../components/inputProdutoModal";
import EditProdutoModal from "../components/editProdutoModal";
import Header from "../components/header"

export default function Home() {
  const router = useRouter(); 

  const [produto, setProduto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [listaCategorias, setListaCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [modalAddProduto, setModalAddProduto] = useState(false);
  const [modalEditProduto, setModalEditProduto] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);
  const [produtoToUpdate, setProdutoToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const getCookie = (name) => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return cookieValue;
      }
      return null;
    };

    const matricula = getCookie("matricula");
    if (!matricula) {
      router.push("/");
    }
  }, [router]);

  
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const filtroProduto = produto
      const filtroCategoria = categoria

      const filtros = {}
      if (filtroProduto) {
        if (filtroProduto !== "")
          filtros.nome = filtroProduto
      }

      if (filtroCategoria) {
        filtros.categoria_id = filtroCategoria
      }

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
    } finally {
      setLoading(false);
    }
  }

  const fetchCategorias = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/categorias', {
          method: 'GET',
        })
  
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.detail);
        }
  
        const data = await response.json();
        setListaCategorias(data.categorias || []);
      } catch (error) {
        setListaCategorias([])
        if (error instanceof Error) {
          
          toast.error(`${error.message}`);
          console.error('Erro ao carregar a lista de categorias:', error.message);
        } else {
          toast.error('Erro desconhecido.');
          console.error('Erro desconhecido:', error);
        }
      } finally {
        setLoading(false);
      }
    }
  
  const openModal = (modal) => {
    if (modal === 'adicionar'){
      setModalAddProduto(true)
    } else if (modal === 'editar'){
      setModalEditProduto(true)
    }
  };

  const closeModal = (modal) => {
    if (modal === 'adicionar'){
      setModalAddProduto(false)
    } else if (modal === 'editar'){
      setModalEditProduto(false)
    }
  };

  const handlePesquisar = () => {
    setLoading(true)
    fetchProdutos()
  }

  const handleDeleteProduto = async (codigo, imagem_url) => {
    try {
      const response = await fetch(`/api/delete-produto?codigo=${codigo}&imagem_url=${imagem_url}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      
      toast.success(data.detail)

      setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.codigo !== codigo));

    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
        console.error('Erro ao deletar produto:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  }

  const confirmDelete = (nome, codigo, imagem_url) => {
    const mensagem = `Tem certeza que deseja excluir o produto: <strong style="color: #000000;">${nome}</strong>`
    setProdutoToDelete({ mensagem, codigo, imagem_url });
    setShowConfirmModal(true);
  };

  const confirmAndDelete = async () => {
    if (produtoToDelete) {
      setLoadingDelete(true)
      
      await handleDeleteProduto(produtoToDelete.codigo, produtoToDelete.imagem_url);
      
      setLoadingDelete(false);
      
      setTimeout(() => {
        setShowConfirmModal(false);
      }, 500);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const confirmUpdate = (codigo) => {
    setProdutoToUpdate(codigo)
    setModalEditProduto(true)
  }

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, [])

    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <div className={styles.conteudo}>
            <div className={styles.titulo}>
              <h2>Estoque de Produtos</h2>
              <p>{produtos.length} produtos disponíveis</p>
            </div>
            <div className={styles.containerBusca}>
              <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Produto"
                    value={produto}
                    onChange={(e) => setProduto(e.target.value)}
                    className={styles.inputField}
                />
                <Image 
                  src="/iconeBusca.png"
                  width={15}
                  height={10}
                  alt="Ícone Busca"
                  onClick={handlePesquisar}
                  className={styles.icon}
                />
              </div>
              <div className={styles.selectContainer}>
                <Image 
                  src="/folder.png"
                  width={15}
                  height={10}
                  alt="Ícone Folder"
                  className={styles.icon}
                />
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={styles.selectField}
                  >
                    <option value="">Categorias</option>
                    {listaCategorias.map((categoriaItem) => (
                      <option key={categoriaItem.id} value={categoriaItem.id}>
                        {categoriaItem.nome}
                      </option>
                    ))}
                </select>
              </div>
              <button className={styles.btnAdicionar} onClick={() => openModal('adicionar')}>+ Novo Produto</button>
            </div>
            <div className={styles.tabelaContainer}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Disponível</th>
                    <th>Tamanho</th>
                    <th>Preço</th>
                    <th>Preço Sócio</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.codigo}>
                      <td>
                        <Image 
                          src={produto.image_url}
                          width={100}
                          height={100} 
                          alt={produto.nome}
                          className={styles.produtoImagem}
                        />
                      </td>
                      <td>{produto.nome}</td>
                      <td>{produto.categoria}</td>
                      <td>{produto.disponivel ? "Sim" : "Não"}</td>
                      <td>{produto.tamanho}</td>
                      <td>R$ {produto.preco}</td>
                      <td>R$ {produto.preco_socio}</td>
                      <td>
                        <div className={styles.containerAcao}>
                          <Image 
                            src="/editar.png"
                            width={15}
                            height={10}
                            alt="Ícone Usuário"
                            className={styles.icon}
                            onClick={() => confirmUpdate(produto.codigo)}
                          />
                          <p>Editar</p>
                        </div>
                      </td>
                      <td>
                        <div className={styles.containerAcao}>
                          <Image 
                            src="/excluir.png"
                            width={10}
                            height={10}
                            alt="Ícone Usuário"
                            className={styles.icon}
                            onClick={() => confirmDelete(produto.nome, produto.codigo, produto.image_url)}
                          />
                          <p>Excluir</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <InputProdutoModal 
            show={modalAddProduto}
            closeModal={closeModal}
            listaCategorias={listaCategorias}
            atualizarTabela={handlePesquisar}
          />
          <EditProdutoModal 
            show={modalEditProduto}
            closeModal={closeModal}
            listaCategorias={listaCategorias}
            codigo={produtoToUpdate}
            atualizarTabela={handlePesquisar}
          />
          <ConfirmModal
            show={showConfirmModal}
            onConfirm={confirmAndDelete}
            onCancel={cancelDelete}
            mensagem={produtoToDelete ? produtoToDelete.mensagem : ""}
            loading={loadingDelete}
          />
        </main>
        <ToastContainer />
      </div>
    );
  }
  