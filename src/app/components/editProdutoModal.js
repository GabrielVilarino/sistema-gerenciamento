"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/editProdutoModal.module.css";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditProdutoModal = ({ show, closeModal, listaCategorias, codigo, atualizarTabela }) => {
    const [codigoProduto, setCodigoProduto] = useState("");
    const [nomeProduto, setNomeProduto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [disponivel, setDisponivel] = useState("true");
    const [preco, setPreco] = useState("");
    const [precoSocio, setPrecoSocio] = useState("");
    const [imagemUrl, setImagemUrl] = useState("");
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);


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

    const getProduto = async () => {
        try {
            const response = await fetch(`/api/produto?codigo=${codigo}`, {
                method: 'GET',
            })
        
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail);
            }
        
            const data = await response.json();

            setCodigoProduto(data.produto.codigo)
            setNomeProduto(data.produto.nome)
            setCategoria(data.produto.categoria_id)
            setTamanho(data.produto.tamanho)
            setDisponivel(data.produto.disponivel)
            setPreco(data.produto.preco)
            setPrecoSocio(data.produto.preco_socio)
            setImagemUrl(data.produto.image_url)
        
            } catch (error) {
            if (error instanceof Error) {
                
                toast.error(`${error.message}`);
                console.error('Erro ao buscar dados do produto:', error.message);
            } else {
                toast.error('Erro desconhecido.');
                console.error('Erro desconhecido:', error);
            }
            }
    }


    const handleEditProduto = async () => {
        setLoading(true)
        if ( codigoProduto === "" || nomeProduto === "" || categoria === "" ||
            tamanho === "" || preco === "" || precoSocio === "" ||
            disponivel === "" || (imagem === null && imagemUrl === "")){
            toast.error("Preencha todos os campos")
            setLoading(false)
            return
            }

        const formData = new FormData();
        formData.append("codigo", codigoProduto);
        formData.append("nome", nomeProduto);
        formData.append("categoria_id", categoria);
        formData.append("tamanho", tamanho);
        formData.append("preco", preco);
        formData.append("preco_socio", precoSocio);
        formData.append("disponivel", disponivel);
        formData.append("imagem_url", imagemUrl)

        if (imagem !== null){
            console.log("Enviando imagem")
            formData.append("imagem", imagem);
        }

        try {
            const response = await fetch('/api/update-produto', {
            method: 'PUT',
            body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                setLoading(false)
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
                console.error('Erro ao atualizar produto:', error.message);
            } else {
                toast.error('Erro desconhecido.');
                console.error('Erro desconhecido:', error);
            }
        }   
    }

    useEffect(() => {
            if (show && codigo) {
                getProduto();
            }
        }, [show, codigo]);

    if (!show) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={() => 
                {
                    closeModal('editar')                                     
                }}
                >X</button>
                <h2>Novo Produto</h2>
                <div className={styles.conteudo}>
                    <div className={styles.fotoInput}>
                        <label className={styles.fileLabel}>
                            {preview ? (
                                <Image src={preview} alt="Prévia da imagem" width={250} height={250} className={styles.previewImage} />
                            ) : (
                                imagemUrl ? (
                                    <Image src={imagemUrl} alt="Imagem salva" width={250} height={250} className={styles.previewImage} />
                                ) : <p style={{ color: "#000000" }}>"Carregando Imagem..."</p>
                            )}
                            <input type="file" accept="image/*" onChange={handleImagemChange} className={styles.fileInput} />
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
                            <label>Código do Produto:</label>
                            <input 
                            type="text" 
                            placeholder="Código Produto" 
                            className={styles.modalInput}
                            value={codigoProduto}
                            onChange={(e) => setCodigoProduto(e.target.value)}
                            disabled
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
                                <label>Disponível:</label>
                                <select
                                    value={disponivel ? "true" : "false"}
                                    onChange={(e) => setDisponivel(e.target.value === "true")}
                                    className={`${styles.selectField} ${styles.selectAddUser}`}
                                >
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                    
                                </select>
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
                <button className={styles.modalButton} onClick={handleEditProduto} disabled={loading}>{!loading ? "Editar" : "Editando..."}</button>
            </div>{ /* Modal Input User*/}
            <ToastContainer />
        </div>
    );
};

export default EditProdutoModal;