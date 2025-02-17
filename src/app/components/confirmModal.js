import React from "react";
import styles from "../styles/confirmModal.module.css";

const ConfirmModal = ({ show, onConfirm, onCancel, mensagem, loading }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 dangerouslySetInnerHTML={{ __html: mensagem }} />
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm} disabled={loading}>{loading ? "Confirmando..." : "Confirmar"}</button>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;