"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "../styles/vendas.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"
import Cookies from "js-cookie";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Vendas() {
  const router = useRouter(); 

  const [nomeCliente, setNomeCliente] = useState("")
  const [socio, setSocio] = useState(0)
  const [cpf, setCpf] = useState("")
  const [turma, setTurma] = useState("")
  const [produto, setProduto] = useState("")
  const [tamanho, setTamanho] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [dataVenda, setDataVenda] = useState("")
  const [obs, setObs] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")
  const [valorEntrada, setValorEntrada] = useState(0)
  const [troco, setTroco] = useState(0)
  const [produtoEncontrado, setProdutoEncontrado] = useState(null)
  const [carrinho, setCarrinho] = useState([])

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

  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return formatted;
  };

  const unformatCpf = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    setCpf(formatCpf(rawValue));
  };

  const fetchProdutos = async () => {

    try {

      if (produto === "") {
        setProdutoEncontrado(null)
        setTamanho("")
        setQuantidade(1)
        return
      }

      const filtro = {
        nome: produto
      }

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtro),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error("Produto não encontrado.")
        return
      }

      const data = await response.json();
      setProdutoEncontrado(data.produtos || []);
    } catch (error) {
      setProdutoEncontrado([])
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao carregar produto:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  }

  const handleAdicionarAoCarrinho = () => {
    if (!produtoEncontrado || produtoEncontrado.length === 0) {
      toast.error("Nenhum produto encontrado!");
      return;
    }

    if (tamanho === "") {
      toast.error("Insira um tamanho para o produto ou digite Sem Tamanho");
      return;
    }
    
    const novoItem = {
      nome: produtoEncontrado[0].nome,
      tamanho: tamanho,
      quantidade: quantidade,
      preco: socio === 1 ? produtoEncontrado[0].preco_socio : produtoEncontrado[0].preco,
      codigo: produtoEncontrado[0].codigo
    }
  
    setCarrinho((prevCarrinho) => [...prevCarrinho, novoItem]);

    setProdutoEncontrado(null)
    setTamanho("")
    setProduto("")
    setQuantidade(1)
  };

  const removerItem = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  const handleFinalizar = async (e) => {
    e.preventDefault();

    if (carrinho.length === 0) {
      toast.error("Carrinho está vazio.")
      return
    }

    if (nomeCliente === "" || cpf === "" || dataVenda === "" || formaPagamento === "") {
      toast.error("Preencha todos os campos")
      console.log(nomeCliente)
      console.log(cpf)
      console.log(dataVenda)
      console.log(formaPagamento)
      return
    }

    const unformattedCpf = unformatCpf(cpf);

    if (unformattedCpf.length != 11){
      toast.error("Insira um cpf válido")
      return
    }

    const isValidDate = !isNaN(Date.parse(dataVenda)) && /^\d{4}-\d{2}-\d{2}$/.test(dataVenda);

    if (!isValidDate) {
      toast.error("Insira uma data válida (formato DD/MM/YYYY)");
      return;
    }

    const formData = {
      matricula: Cookies.get("matricula"),
      nome_cliente: nomeCliente,
      cpf_cliente: unformattedCpf,
      turma: turma || null,
      socio: socio === 1,
      data_venda: dataVenda,
      forma_pagamento: formaPagamento,
      obs: obs || null,
      troco: troco,
      produtos: carrinho.map(item => ({
        codigo_produto: item.codigo,
        quantidade: item.quantidade,
        valor_produto: item.quantidade * item.preco,
        tamanho: item.tamanho.toUpperCase(),
        nome_produto: item.nome
      })),
      valor_pago: valorEntrada
    }

    toast.info("Finalizando Venda")
    try {
        const response = await fetch('/api/add-venda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(formData),
        })

        if (!response.ok) {
            const data = await response.json()
            console.log(data)
            throw new Error(data.detail);
        }

        const data = await response.json();
        
        toast.success("Venda Realizada com sucesso")

    } catch (error) {
        if (error instanceof Error) {

            toast.error(`${error.message}`);
            console.error('Erro ao adicionar produto:', error.message);
        } else {
            toast.error('Erro desconhecido.');
            console.error('Erro desconhecido:', error);
        }
    } finally {
        handleLimpar()
    }
  }

  const handleLimpar = () => {
    setNomeCliente("")
    setSocio(0)
    setCpf("")
    setTurma("")
    setProduto("")
    setTamanho("")
    setQuantidade(1)
    setDataVenda("")
    setObs("")
    setFormaPagamento("")
    setValorEntrada(0)
    setTroco(0)
    setProdutoEncontrado(null)
    setCarrinho([])
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <SidebarMenuAdmin />
        <div className={styles.conteudo}>
          <p>Vendas</p>
          <div className={styles.container}>
            <section className={styles.dadosCliente}>
              <div className={styles.labelInput} style={{width: "50%"}}>
                <label>Nome do Cliente:</label>
                <input
                    type="text"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "15%"}}>
                <label>Sócio:</label>
                <select 
                  className={styles.selectField}
                  value={socio}
                  onChange={(e) => setSocio(Number(e.target.value))}
                >
                  <option value={1}>Sim</option>
                  <option value={0}>Não</option>
                </select>
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "30%"}}>
                <label>CPF:</label>
                <input
                    type="text"
                    value={cpf}
                    onChange={(e) => handleChange(e)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "25%"}}>
                <label>Turma:</label>
                <input
                    type="text"
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
            </section> {/* Dados do Cliente */}
            <section className={styles.itens}>
              <div className={styles.containerImagemProduto}>
                {produtoEncontrado ? (
                    <Image 
                      src={produtoEncontrado[0].image_url} 
                      width={100} 
                      height={100} 
                      alt="Imagem do Produto" 
                      className={styles.produtoImagem}
                    />
                  ) : (
                    <div className={styles.placeholder}></div>
                  )}
              </div>
              <div className={styles.dadosProduto}>
                <div className={styles.labelInput} style={{width: "100%"}}>
                  <label>Nome do Produto:</label>
                  <div className={styles.inputImagem}>
                    <input
                        type="text"
                        value={produto}
                        onChange={(e) => setProduto(e.target.value)}
                        className={styles.inputField}
                        style={{width: "100%"}}
                    />
                    <Image 
                      src="/iconeBusca.png"
                      width={20}
                      height={20}
                      alt="Ícone Busca"
                      className={styles.icon}
                      onClick={fetchProdutos}
                      style={{cursor: "pointer"}}
                    />
                  </div>
                </div> {/* labelInput */}
                <div className={styles.doisInput}>
                  <div className={styles.labelInput} style={{width: "50%"}}>
                    <label>Tamanho:</label>
                    <input
                        type="text"
                        value={tamanho}
                        onChange={(e) => setTamanho(e.target.value)}
                        className={styles.inputField}
                    />
                  </div> {/* labelInput */}
                  <div className={styles.labelInput} style={{width: "50%"}}>
                    <label>Quantidade:</label>
                    <input
                        type="number"
                        min={1}
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        className={styles.inputField}
                    />
                  </div> {/* labelInput */}
                </div> {/* Dois Inputs */}
                <button onClick={handleAdicionarAoCarrinho}>Adicionar</button>
              </div>
              <div className={styles.containerCarrinho}>
                <div className={styles.carrinho}>
                  <div className={styles.titulo}>
                    <p>Itens</p>
                  </div>
                  <div className={styles.itensCarrinho}>
                    {carrinho.length > 0 ? (
                      carrinho.map((item, index) => (
                        <div key={index} className={styles.itemCarrinho}>
                          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                            <Image 
                              src="/excluir.png"
                              width={13}
                              height={15}
                              alt="Ícone Lixeira"
                              className={styles.icon}
                              style={{cursor: "pointer"}}
                              onClick={() => removerItem(index)}
                            />
                            <p title={item.nome}>{item.nome.length > 10 ? item.nome.slice(0, 7) + "..." : item.nome.padEnd(10, " ")}</p>
                          </div>
                          <p>Quantidade: {item.quantidade}</p>
                          <p>Preço: R$ {(item.quantidade * item.preco).toFixed(2)}</p>
                        </div>
                      ))
                    ) : (
                      <p>Seu carrinho está vazio.</p>
                    )}
                  </div>
                </div>
                <div className={styles.footerCarrinho}>
                  <p>Total: </p>
                  <p>R$ {carrinho.reduce((total, item) => total + item.quantidade * item.preco, 0).toFixed(2)} </p>
                </div>
              </div>{ /* Carrinho */}
            </section>{/* Adicionar Item */}
            <section className={styles.dadosPagamento}>
              <div className={styles.labelInput} style={{width: "15%"}}>
                <label>Data:</label>
                <input
                    type="date"
                    value={dataVenda}
                    onChange={(e) => setDataVenda(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "20%"}}>
                <label>Observação:</label>
                <input
                    type="text"
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "20%"}}>
                <label>Forma de Pagamento:</label>
                <select 
                  className={styles.selectField}
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  <option value={""}>Selecionar</option>
                  <option value={"Pix"}>Pix</option>
                  <option value={"Dinheiro"}>Dinheiro</option>
                  <option value={"Crédito"}>Crédito</option>
                  <option value={"Débito"}>Débito</option>
                </select>
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "20%"}}>
                <label>Valor Pago:</label>
                <input
                    type="number"
                    value={valorEntrada}
                    onChange={(e) => setValorEntrada(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
              <div className={styles.labelInput} style={{width: "10%"}}>
                <label>Troco:</label>
                <input
                    type="number"
                    value={troco}
                    onChange={(e) => setTroco(e.target.value)}
                    className={styles.inputField}
                />
              </div> {/* labelInput */}
            </section> {/* Dados Pagamento */}
            <section className={styles.botoes}>
              <button className={styles.finalizar} onClick={handleFinalizar}>Finalizar</button>
              <button className={styles.cancelar} onClick={handleLimpar}>Cancelar</button>
            </section> {/* Botões Finalizar */}
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
  