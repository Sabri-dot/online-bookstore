import React, { useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaLock } from 'react-icons/fa';

const PaymentModal = ({ book, onClose, onConfirm }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentInfo = { cardNumber, cardName, expiry, cvv, password };
    onConfirm(paymentInfo);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Paguaj për: <span style={{ color: '#4CAF50' }}>{book.title}</span></h2>
        <div style={styles.cardIcons}>
          <FaCcVisa size={36} color="#1a1f71" />
          <FaCcMastercard size={36} color="#eb001b" />
          <FaLock size={24} color="#888" title="E sigurt" />
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="💳 Numri i kartës (16 shifra)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            style={styles.input}
            maxLength={16}
          />
          <input
            type="text"
            placeholder="👤 Emri mbi kartë"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.row}>
            <input
              type="text"
              placeholder="📅 Skadenca (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
              style={{ ...styles.input, flex: 1 }}
              maxLength={5}
            />
            <input
              type="text"
              placeholder="🔒 CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              style={{ ...styles.input, flex: 1, marginLeft: 8 }}
              maxLength={3}
            />
          </div>
          <input
            type="password"
            placeholder="🔑 Fjalëkalimi për verifikim"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.buttons}>
            <button type="submit" style={styles.payBtn}>💰 Paguaj</button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Anulo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 9999
  },
  modal: {
    background: '#fff', padding: 30, borderRadius: 12,
    width: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    marginBottom: 10, fontSize: 20, fontWeight: 'bold', textAlign: 'center'
  },
  cardIcons: {
    display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 12
  },
  input: {
    padding: 10, fontSize: 14, borderRadius: 6,
    border: '1px solid #ccc', outline: 'none', transition: '0.2s'
  },
  row: {
    display: 'flex', gap: 8
  },
  buttons: {
    display: 'flex', justifyContent: 'space-between', marginTop: 20
  },
  payBtn: {
    backgroundColor: '#4CAF50', color: '#fff',
    padding: '10px 20px', border: 'none',
    borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
  },
  cancelBtn: {
    backgroundColor: '#f44336', color: '#fff',
    padding: '10px 20px', border: 'none',
    borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
  }
};

export default PaymentModal;
