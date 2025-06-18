import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };

    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('login', checkLogin);
    window.addEventListener('logout', checkLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', checkLogin);
      window.removeEventListener('logout', checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5001/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    setIsLoggedIn(false);
    setRole(null);
    window.dispatchEvent(new Event('logout'));
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>Online Book Store</Link>

      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/books" style={styles.link}>Librat</Link>
        <Link to="/about" style={styles.link}>Rreth Nesh</Link>
        <Link to="/contact" style={styles.link}>Kontakt</Link>
        {role === 'admin' && (
          <>
            <Link to="/admin/books" style={styles.link}>Menaxho Librat (Admin)</Link> 
            <Link to="/admin/comments" style={styles.link}>Menaxho Komentet (Admin)</Link>
            <Link to="/admin/genres" style={styles.link}>Menaxho Zhanret (Admin)</Link>
            <Link to="/admin/purchases" style={styles.link}>Menaxho Blerjet (Admin)</Link>
            <Link to="/admin/users" style={styles.link}>Menaxho Përdoruesit (Admin)</Link>
            <Link to="/admin/emails" style={styles.link}>Menaxho Email-at (Admin)</Link>
            <Link to="/admin/logs" className="nav-link">Menaxho Log-et(Admin)</Link>
          </>
        )}
      </div>

      <div style={styles.authSection}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ ...styles.link, marginRight: 15 }}>Login</Link>
            <Link to="/register" style={styles.button}>Register</Link>
          </>
        ) : (
          <div style={styles.userMenu}>
            <div onClick={handleLogout} style={styles.dropdownItemLogout}>
              Log out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#1877F2',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 16,
    transition: 'color 0.3s',
    cursor: 'pointer',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: 'white',
    color: '#1877F2',
    borderRadius: 4,
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userMenu: {
    position: 'relative',
  },
  dropdownItemLogout: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
    textDecoration: 'none',
    color: 'red',
    fontWeight: 'bold',
  }
};

export default Navbar;
