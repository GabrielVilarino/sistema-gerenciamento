"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/usuarios.module.css";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"
import ConfirmModal from "../components/confirmModal";
import InputUserModal from "../components/inputUserModal";
import EditUserModal from "../components/editUserModal";

export default function Usuarios() {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [listaCargos, setListaCargos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [modalEditUser, setModalEditUser] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);

  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filtroNome = nome
      const filtroCargo = cargo

      const filtros = {}
      if (filtroNome) {
        if (filtroNome !== "")
          filtros.nome = filtroNome
      }

      if (filtroCargo) {
        filtros.cargo_id = filtroCargo
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      setUsers(data.usuarios || []);
    } catch (error) {
      setUsers([])
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao carregar a lista de usuários:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cargos', {
        method: 'GET',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      setListaCargos(data.cargos || []);
    } catch (error) {
      setListaCargos([])
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao carregar a lista de cargos:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handlePesquisar = () => {
    setLoading(true)
    fetchUsers()
  }

  const handleDeleteUser = async (matricula) => {

    try {
      const response = await fetch(`/api/delete-user?matricula=${matricula}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      
      toast.success(data.detail)

      setUsers((prevUsers) => prevUsers.filter((user) => user.matricula !== matricula));

    } catch (error) {
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao deletar usuário:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  }

  const openModal = (modal) => {
    if (modal === 'adicionar'){
      setModalAddUser(true)
    } else if (modal === 'editar'){
      setModalEditUser(true)
    }
  };

  const closeModal = (modal) => {
    if (modal === 'adicionar'){
      setModalAddUser(false)
    } else if (modal === 'editar'){
      setModalEditUser(false)
    }
  };

  const confirmDelete = (nome, matricula) => {
    const mensagem = `Tem certeza que deseja excluir o usuário: <strong style="color: #000000;">${nome}</strong>`
    setUserToDelete({ mensagem, matricula });
    setShowConfirmModal(true);
  };

  const confirmUpdate = (matricula) => {
    setUserToUpdate(matricula)
    setModalEditUser(true)
  }

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const confirmAndDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.matricula);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCargos();
  }, [])
  
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <SidebarMenuAdmin />
          <section className={styles.conteudo}>
            <h2>Usuários</h2>
            <div className={styles.containerBusca}>
              <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={styles.inputField}
                />
                <Image 
                  src="/iconeBusca.png"
                  width={15}
                  height={10}
                  alt="Ícone Usuário"
                  onClick={handlePesquisar}
                  className={styles.icon}
                />
              </div>
              <div className={styles.selectContainer}>
                <Image 
                  src="/user.png"
                  width={15}
                  height={10}
                  alt="Ícone Usuário"
                  className={styles.icon}
                />
                <select
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className={styles.selectField}
                  >
                    <option value="">Cargos</option>
                    {listaCargos.map((cargoItem) => (
                      <option key={cargoItem.id} value={cargoItem.id}>
                        {cargoItem.nome}
                      </option>
                    ))}
                </select>
              </div>
              <button className={styles.btnAdicionar} onClick={() => openModal('adicionar')}>+ Novo Usuário</button>
            </div>
            <div className={styles.tabelaContainer}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Usuário</th>
                    <th>Turma</th>
                    <th>Permissão</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((usuario) => (
                    <tr key={usuario.matricula}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.cargo}</td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.turma}</td>
                      <td>{usuario.permissao}</td>
                      <td>
                        <div className={styles.containerAcao}>
                          <Image 
                            src="/editar.png"
                            width={15}
                            height={10}
                            alt="Ícone Usuário"
                            className={styles.icon}
                            onClick={() => confirmUpdate(usuario.matricula)}
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
                            onClick={() => confirmDelete(usuario.nome, usuario.matricula)}
                          />
                          <p>Excluir</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <InputUserModal 
            show={modalAddUser}
            closeModal={closeModal}
            listaCargos={listaCargos}
            atualizarTabela={handlePesquisar}
          />
          <EditUserModal 
            show={modalEditUser}
            closeModal={closeModal}
            listaCargos={listaCargos}
            matricula={userToUpdate}
            atualizarTabela={handlePesquisar}
          />
          <ConfirmModal
            show={showConfirmModal}
            onConfirm={confirmAndDelete}
            onCancel={cancelDelete}
            mensagem={userToDelete ? userToDelete.mensagem : ""}
          />
        </main>
        <ToastContainer />
      </div>
    );
  }
  