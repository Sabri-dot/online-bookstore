import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('JohnDoe');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
    console.log('User logged out');
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
      </div>

      <div style={styles.authSection}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ ...styles.link, marginRight: 15 }}>Login</Link>
            <Link to="/register" style={styles.button}>Register</Link>
          </>
        ) : (
          <div style={styles.userMenu}>
            <div onClick={toggleDropdown} style={styles.username}>
              {username} &#x25BC;
            </div>
            {dropdownOpen && (
              <div style={styles.dropdown}>
                <Link to="/profile" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>Profile</Link>
                <Link to="/orders" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>Orders</Link>
                <div style={styles.dropdownItem} onClick={handleLogout}>Logout</div>
              </div>
            )}
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
    cursor: 'pointer',
  },
  username: {
    fontWeight: 'bold',
    userSelect: 'none',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    right: 0,
    backgroundColor: 'white',
    color: '#1877F2',
    borderRadius: 4,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    minWidth: 120,
    zIndex: 200,
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
    textDecoration: 'none',
    color: '#1877F2',
  },
};

export default Navbar;
