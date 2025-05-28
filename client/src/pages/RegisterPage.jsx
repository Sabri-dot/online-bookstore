import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Ju lutem shkruani username.');
      return;
    }
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
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gabim gjatë regjistrimit.');
        return;
      }

      setSuccess('Regjistrimi u krye me sukses! Ju lutem kyçu.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Gabim gjatë lidhjes me serverin.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.projectTitle}>Online Book Store</h1>
        <h2 style={styles.subtitle}>Regjistrohu</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
        {success && <div style={styles.success}>{success}</div>}
        <button style={styles.button} type="submit">Regjistrohu</button>
        <p style={styles.text}>
          Ke llogari? <a href="/login" style={styles.link}>Kyçu këtu</a>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    backgroundColor: '#f2f2f2',
  },
  form: {
    backgroundColor: '#fff', padding: 30, borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: 320,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  projectTitle: {
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '100%', padding: 10, marginBottom: 15,
    borderRadius: 4, border: '1px solid #ccc', fontSize: 16,
  },
  button: {
    width: '100%', padding: 10, backgroundColor: '#4CAF50',
    color: 'white', border: 'none', borderRadius: 4,
    cursor: 'pointer', fontSize: 16,
  },
  error: {
    color: 'red', marginBottom: 10,
  },
  success: {
    color: 'green', marginBottom: 10,
  },
  text: {
    marginTop: 15,
    color: '#555',
  },
  link: {
    color: '#4CAF50',
    textDecoration: 'none',
  },
};

export default RegisterPage;
