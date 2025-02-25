"use client"
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/inputProdutoModal.module.css";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const InputUserModal = ({ show, closeModal, listaCategorias, atualizarTabela }) => {
    const [nomeProduto, setNomeProduto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco, setPreco] = useState("");
    const [precoSocio, setPrecoSocio] = useState("");
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);


    const handleImagemChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
            setImagem(null);
        }
    };


    const handleAdicionarProduto = async () => {
        setLoading(true)
        if ( nomeProduto === "" || categoria === "" ||
            tamanho === "" || preco === "" || precoSocio === "" ||
            quantidade === "" || imagem === null){
            toast.error("Preencha todos os campos")
            setLoading(false)
            return
            }

        const formData = new FormData();
        formData.append("nome", nomeProduto);
        formData.append("categoria_id", categoria);
        formData.append("tamanho", tamanho.toUpperCase());
        formData.append("preco", preco);
        formData.append("preco_socio", precoSocio);
        formData.append("quantidade", quantidade);
        formData.append("imagem", imagem);

        try {
            const response = await fetch('/api/add-produto', {
            method: 'POST',
            body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail[0].msg);
            }

            const data = await response.json();
            
            toast.success(data.detail)

            atualizarTabela()
            setLoading(false)

        } catch (error) {
            if (error instanceof Error) {

                if (error.message == "Input should be a valid integer, unable to parse string as an integer"){
                    error.message = "É válido somente números na matricula"
                }

                toast.error(`${error.message}`);
                console.error('Erro ao adicionar produto:', error.message);
            } else {
                toast.error('Erro desconhecido.');
                console.error('Erro desconhecido:', error);
            }
        } finally {
            setNomeProduto("")
            setCategoria("")
            setTamanho("")
            setPreco("")
            setPrecoSocio("")
            setQuantidade("")
            setPreview(null)
            setImagem(null)
            setLoading(false)

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }    
    }

    const resetInput = () => {
        setNomeProduto("")
        setCategoria("")
        setTamanho("")
        setPreco("")
        setPrecoSocio("")
        setQuantidade("")
        setPreview(null)
        setImagem(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    if (!show) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={() => 
                {
                    closeModal('adicionar')
                    resetInput()                                      
                }}
                >X</button>
                <h2>Novo Produto</h2>
                <div className={styles.conteudo}>
                    <div className={styles.fotoInput}>
                        <label className={styles.fileLabel}>
                            {preview && (
                                <Image src={preview} alt="Prévia da imagem" width={250} height={250} className={styles.previewImage} />
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagemChange} className={styles.fileInput} />
                        </label>
                    </div>
                    <div className={styles.form}>
                        <div className={styles.divInput}>
                            <label>Nome do Produto:</label>
                            <input 
                            type="text" 
                            placeholder="Nome Produto" 
                            className={styles.modalInput}
                            value={nomeProduto}
                            onChange={(e) => setNomeProduto(e.target.value)}
                            />
                        </div> {/* input nome Produto */}
                        <div className={styles.divInput}>
                            <label>Categoria:</label>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className={`${styles.selectField} ${styles.selectAddUser}`}
                            >
                                <option value="">Selecionar</option>
                                {listaCategorias.map((categoriaItem) => (
                                <option key={categoriaItem.id} value={categoriaItem.id}>
                                    {categoriaItem.nome}
                                </option>
                                ))}
                            </select>
                        </div> {/* inputs */}
                        <div className={styles.linha}>
                            <div className={`${styles.divInput} ${styles.inputPrincipal}`}>
                                <label>Tamanho:</label>
                                <input 
                                    type="text" 
                                    placeholder="Tamanho" 
                                    className={styles.modalInput}
                                    value={tamanho}
                                    onChange={(e) => setTamanho(e.target.value)}
                                />
                            </div> {/* input Tamanho */}
                            
                            <div className={`${styles.divInput} ${styles.inputSecundario}`}>
                                <label>Quantidade:</label>
                                    <input 
                                        type="number" 
                                        placeholder="Quantidade" 
                                        min={1}
                                        className={styles.modalInput}
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                    />
                            </div>
                        </div> {/* linha para dois inputs */}
                        <div className={styles.linha}>
                            <div className={`${styles.divInput} ${styles.inputPrincipal}`}>
                                <label>Preço:</label>
                                <input 
                                    type="number" 
                                    className={styles.modalInput}
                                    placeholder="Preço"
                                    min={1}
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </div> {/* input preço */}
                            <div className={`${styles.divInput} ${styles.inputSecundario}`}>
                                <label>Preço Sócio:</label>
                                <input 
                                    type="number" 
                                    className={styles.modalInput}
                                    placeholder="Preço Sócio"
                                    min={1}
                                    value={precoSocio}
                                    onChange={(e) => setPrecoSocio(e.target.value)}
                                />
                            </div> {/* input preço sócio*/}
                        </div> {/* linha para dois inputs */}
                    </div>
                </div>
                <button className={styles.modalButton} onClick={handleAdicionarProduto} disabled={loading}>{!loading ? "Adicionar" : "Adicionando..."}</button>
            </div>{ /* Modal Input User*/}
            <ToastContainer />
        </div>
    );
};

export default InputUserModal;