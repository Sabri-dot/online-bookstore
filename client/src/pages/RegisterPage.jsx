import React, { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validimi bazik
    if (!email.includes('@')) {
      setError('Email-i nuk është i saktë.');
      return;
    }
    if (password.length < 6) {
      setError('Fjalëkalimi duhet të jetë të paktën 6 karaktere.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.');
      return;
    }
    setError('');
    // Këtu do thërras API për regjistrim
    console.log('Regjistrim me', email, password);
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Titulli i projektit */}
        <h1 style={styles.projectTitle}>Online Book Store</h1>
        {/* Nën-titulli */}
        <h2 style={styles.subtitle}>Krijo një llogari të re</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Fjalëkalim"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Konfirmo fjalëkalimin"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit">Regjistrohu</button>
        <p style={styles.text}>
          Ke llogari? <a href="/login" style={styles.link}>Kyqu këtu</a>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  form: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: 350,
    display: 'flex',
    flexDirection: 'column',
  },
  projectTitle: {
    marginBottom: 4,
    textAlign: 'center',
    color: '#1877F2',
    fontWeight: 'bold',
    fontSize: 28,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#1877F2',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#1877F2',
    textDecoration: 'none',
  },
};

export default RegisterPage;
