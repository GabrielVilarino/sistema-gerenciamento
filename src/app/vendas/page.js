"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/vendas.module.css";
import SidebarMenuAdmin from "../components/sideBarMenuAdmin"
import Header from "../components/header"

export default function Vendas() {
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
  const [valorEntrada, setValorEntrada] = useState(0.00)
  const [troco, setTroco] = useState(0.00)


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
                      onChange={(e) => setCpf(e.target.value)}
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
                <div className={styles.teste}></div>
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
                  <button>Adicionar</button>
                </div>
                <div className={styles.containerCarrinho}>
                  <div className={styles.carrinho}>
                    <div className={styles.titulo}>
                      <p>Itens</p>
                    </div>
                  </div>
                  <div className={styles.footerCarrinho}>
                    <p>Total: </p>
                    <p>R$ 0,00 </p>
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
                    onChange={(e) => setFormaPagamento(Number(e.target.value))}
                  >
                    <option value={""}>Selecionar</option>
                    <option value={"Pix"}>Pix</option>
                    <option value={"Dinheiro"}>Dinheiro</option>
                    <option value={"Crédito"}>Crédito</option>
                    <option value={"Débito"}>Débito</option>
                  </select>
                </div> {/* labelInput */}
                <div className={styles.labelInput} style={{width: "20%"}}>
                  <label>Valor de Entrada:</label>
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
                <button className={styles.finalizar}>Finalizar</button>
                <button className={styles.cancelar}>Cancelar</button>
              </section> {/* Botões Finalizar */}
            </div>
          </div>
        </main>
      </div>
    );
}
  