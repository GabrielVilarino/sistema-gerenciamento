"use client"
import { useState, useEffect } from "react";
import React from "react";
import styles from "../styles/editUserModal.module.css";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditUserModal = ({ show, closeModal, listaCargos, matricula, atualizarTabela }) => {
    const [matriculaNew, setMatriculaNew] = useState("");
    const [nomeNew, setNomeNew] = useState("");
    const [userNew, setUserNew] = useState("");
    const [senhaNew, setSenhaNew] = useState("");
    const [cargoNew, setCargoNew] = useState("");
    const [turmaNew, setTurmaNew] = useState("");
    const [permissaoNew, setPermissaoNew] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const getUser = async () => {
        try {
            const response = await fetch(`/api/user?matricula=${matricula}`, {
              method: 'GET',
            })
      
            if (!response.ok) {
              const data = await response.json()
              throw new Error(data.detail);
            }
      
            const data = await response.json();

            setMatriculaNew(data.usuario.matricula)
            setNomeNew(data.usuario.nome)
            setUserNew(data.usuario.usuario)
            setSenhaNew(data.usuario.senha)
            setTurmaNew(data.usuario.turma)
            setPermissaoNew(data.usuario.permissao)
            setCargoNew(data.usuario.cargo_id)
      
          } catch (error) {
            if (error instanceof Error) {
              
              toast.error(`${error.message}`);
              console.error('Erro ao buscar dados do usuário:', error.message);
            } else {
              toast.error('Erro desconhecido.');
              console.error('Erro desconhecido:', error);
            }
          }
    }

    const handleEditUser = async () => {

        if (matriculaNew === "" || nomeNew === "" || userNew === "" ||
            senhaNew === "" || turmaNew === "" || permissaoNew === "" ||
            cargoNew === "" ){
            toast.error("Preencha todos os campos")
            return
            }

        const input = {
            matricula: matriculaNew,
            nome: nomeNew,
            usuario: userNew,
            senha: senhaNew,
            turma: turmaNew,
            permissao: permissaoNew,
            cargo_id: cargoNew
        }

        try {
            const response = await fetch('/api/update-user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
            })

            if (!response.ok) {
            const data = await response.json()
            throw new Error(data.detail);
            }

            const data = await response.json();
            
            toast.success(data.detail)

            atualizarTabela()


        } catch (error) {
            if (error instanceof Error) {
                toast.error(`${error.message}`);
                console.error('Erro ao atualizar usuário:', error.message);
            } else {
                toast.error('Erro desconhecido.');
                console.error('Erro desconhecido:', error);
            }
        }   
    }

    useEffect(() => {
        if (show && matricula) {
            getUser();
        }
    }, [show, matricula]);

    if (!show) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => 
            {
                closeModal('editar')
                setShowPassword(false)
            }
            }>X</button>
            <h2>Editar Usuário</h2>
            <div className={styles.divInput}>
                <label>Nome Completo:</label>
                <input 
                    type="text" 
                    placeholder="Nome Completo" 
                    className={styles.modalInput}
                    value={nomeNew}
                    onChange={(e) => setNomeNew(e.target.value)}
                />
            </div> {/* input nome completo */}
            <div className={styles.divInput}>
                <label>Matrícula:</label>
                <input 
                    type="text" 
                    placeholder="Matrícula" 
                    className={styles.modalInput}
                    value={matriculaNew}
                    onChange={(e) => setMatriculaNew(e.target.value)}
                    disabled
                />
            </div> {/* input matricula */}
            <div className={styles.linha}>
                <div className={`${styles.divInput} ${styles.inputPrincipal}`}>
                    <label>Usuário:</label>
                    <input 
                        type="text" 
                        placeholder="Usuário" 
                        className={styles.modalInput}
                        value={userNew}
                        onChange={(e) => setUserNew(e.target.value)}
                    />
                </div> {/* input usuário */}
                
                <div className={`${styles.divInput} ${styles.inputSecundario}`}>
                    <label>Senha:</label>
                    <div className={styles.passwordContainer}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Senha" 
                            className={styles.modalInput}
                            value={senhaNew}
                            onChange={(e) => setSenhaNew(e.target.value)}
                            id="senha"
                            autoComplete="off"
                        />
                        <img 
                            src={showPassword ? "/abrir.png" : "/ocultar.png"} 
                            alt="Mostrar senha" 
                            className={styles.eyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div> {/* input senha */}
            </div> {/* linha para dois inputs */}
            <div className={styles.divInput}>
                <label>Cargo:</label>
                <select
                    value={cargoNew}
                    onChange={(e) => setCargoNew(e.target.value)}
                    className={`${styles.selectField} ${styles.selectAddUser}`}
                >
                    <option value="">Selecionar</option>
                    {listaCargos.map((cargoItem) => (
                    <option key={cargoItem.id} value={cargoItem.id}>
                        {cargoItem.nome}
                    </option>
                    ))}
                </select>
            </div> {/* inputs */}
            <div className={styles.linha}>
                <div className={`${styles.divInput} ${styles.inputPrincipal}`}>
                <label>Turma:</label>
                <input 
                    type="text" 
                    placeholder="Turma" 
                    className={styles.modalInput}
                    value={turmaNew}
                    onChange={(e) => setTurmaNew(e.target.value)}
                />
                </div> {/* input usuario */}
                <div className={`${styles.divInput} ${styles.inputSecundario}`}>
                <label>Permissão:</label>
                <select
                    value={permissaoNew}
                    onChange={(e) => setPermissaoNew(e.target.value)}
                    className={`${styles.modalInput} ${styles.selectPermissao}`}
                    >
                    <option value="">Selecionar</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="USER">Usuário</option>
                </select>
                </div> {/* input senha*/}
            </div> {/* linha para dois inputs */}
            <button className={styles.modalButton} onClick={handleEditUser}>Editar</button>
            </div>{ /* Modal Input User*/}
            <ToastContainer />
        </div>
    );
};

export default EditUserModal;