"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "../styles/relatorios.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"
import ConfirmModal from "../components/confirmModal";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Relatorio() {
  const router = useRouter(); 

  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [cpf, setCpf] = useState("")
  const [vendas, setVendas] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [vendaToDelete, setVendaToDelete] = useState(null);

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

  const handlePesquisar = async () => {
    if ((dataInicio !== "" && dataFim === "") || (dataInicio === "" && dataFim !== "")) {
      toast.error("Para buscar por data é preciso inserir Data Início e Data Fim")
      return
    }

    if (dataInicio !== "" && dataFim !== "") {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      if (inicio > fim){
        toast.error("Insira uma data de início menor que a data final")
        return
      }
    }

    try {
      const filtroDatainicio = dataInicio
      const filtroDataFim = dataFim
      const filtroCpf = cpf

      const filtros = {}
      if (filtroDatainicio) {
        if (filtroDatainicio !== "")
          filtros.data_inicio = filtroDatainicio
      }
      if (filtroDataFim) {
        if (filtroDataFim !== "")
          filtros.data_fim= filtroDataFim
      }

      if (filtroCpf) {
        if (filtroCpf !== "")
        filtros.cpf = filtroCpf
      }

      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtros),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      setVendas(data.vendas || []);
    } catch (error) {
      setVendas([])
      if (error instanceof Error) {
        
        toast.error(`${error.message}`);
        console.error('Erro ao carregar a lista de produtos:', error.message);
      } else {
        toast.error('Erro desconhecido.');
        console.error('Erro desconhecido:', error);
      }
    }
  }

  const handleDeleteVenda = async (id) => {
    try {
      const response = await fetch(`/api/delete-venda?id_venda=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail);
      }

      const data = await response.json();
      
      toast.success(data.detail)

      setVendas((prevVendas) => prevVendas.filter((venda) => venda.id !== id));

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

  const confirmDelete = (nome, id) => {
    const mensagem = `Tem certeza que deseja excluir venda do(a): <strong style="color: #000000;">${nome}</strong>`
    setVendaToDelete({ mensagem, id });
    setShowConfirmModal(true);
  };

  const confirmAndDelete = async () => {
    if (vendaToDelete) {
      setLoadingDelete(true)
      
      await handleDeleteVenda(vendaToDelete.id);
      
      setLoadingDelete(false);
      
      setTimeout(() => {
        setShowConfirmModal(false);
      }, 500);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleBaixar = async () => {
    if (vendas.length === 0) {
      toast.error("Nenhum dado disponível para download.");
      return;
    }
  
    try {
      const response = await fetch("/api/exportar-planilha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendas),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao gerar o arquivo.");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_vendas.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  
      toast.success("Download realizado com sucesso!");
    } catch (error) {
      toast.error(error.message);
      console.error("Erro ao baixar relatório:", error);
    }
  };
  
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <SidebarMenuAdmin />
        <div className={styles.conteudo}>
          <p>Relatórios</p>
          <div className={styles.container}>
            <div className={styles.containerInputs}>
              <div className={styles.inputsData}>
                <label>De</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className={styles.inputField}
                />
                <label>até</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className={styles.inputField}
                />
              </div> {/* Inputs Data*/}
              <div className={styles.inputCpf}>
                <label>CPF:</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className={styles.inputField}
                />
              </div> {/* Input CPF*/}
              <div className={styles.buttons}>
                <button onClick={handlePesquisar}>Procurar</button>
                <button onClick={handleBaixar}>Baixar</button>
              </div>
            </div> {/* DIV Container inputs*/}
          </div> {/* DIV Container*/}
          <div className={styles.tabelaContainer}>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Nome do Cliente</th>
                    <th>Cpf do Cliente</th>
                    <th>Sócio</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Valor Produto</th>
                    <th>Valor Total</th>
                    <th>Vendedor</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.nome_cliente}</td>
                      <td>{venda.cpf_cliente}</td>
                      <td>{venda.socio ? "Sim" : "Não"}</td>
                      <td>{venda.produto_nome}</td>
                      <td>{venda.quantidade}</td>
                      <td>{venda.valor_produto}</td>
                      <td>{venda.valor_pago}</td>
                      <td>{venda.usuario_nome}</td>
                      <td>
                        <div className={styles.containerAcao}>
                          <Image 
                            src="/excluir.png"
                            width={10}
                            height={10}
                            alt="Ícone Usuário"
                            className={styles.icon}
                            onClick={() => confirmDelete(venda.nome_cliente, venda.id)}
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
        <ConfirmModal
            show={showConfirmModal}
            onConfirm={confirmAndDelete}
            onCancel={cancelDelete}
            mensagem={vendaToDelete ? vendaToDelete.mensagem : ""}
            loading={loadingDelete}
        />
      </main>
      <ToastContainer />
    </div>
  );
}
  