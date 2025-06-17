import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ndjek ndryshimet në localStorage në tab të ndryshëm
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    // Ndjek event custom 'login' për të reaguar në të njëjtin tab
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('login', checkLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');  // KETU HEQIM EDHE ROLE
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        Online Book Store
      </Link>

      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/books" style={styles.link}>Librat</Link>
        <Link to="/about" style={styles.link}>Rreth Nesh</Link>
        <Link to="/contact" style={styles.link}>Kontakt</Link>
        {/* Këtu shtojmë link për Admin vetëm nëse është admin */}
        {role === 'admin' && (
  <>
    <Link to="/admin/books" style={styles.link}>Menaxho Librat (Admin)</Link>
    <Link to="/admin/comments" style={styles.link}>Menaxho Komentet (Admin)</Link>
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
            <div
              onClick={handleLogout}
              style={styles.dropdownItemLogout}
            >
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
