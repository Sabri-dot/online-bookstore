import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={{ ...styles.link, marginRight: 60, fontWeight: 'bold', fontSize: 32 }}>
        Online Book Store
      </Link>

      <div style={styles.navLinks}>
        <Link to="/" style={{ ...styles.link, marginRight: 80,fontSize:22 }}>Home</Link>
        <Link to="/books" style={{ ...styles.link, marginRight: 80,fontSize:22 }}>Librat</Link>
        <Link to="/about" style={{ ...styles.link, marginRight: 80,fontSize:22  }}>Rreth Nesh</Link>
        <Link to="/contact" style={{ ...styles.link, marginRight: 80,fontSize:22  }}>Kontakt</Link>

        {role === 'admin' && (
          <div style={{ position: 'relative', marginRight:80 ,fontSize:22}} ref={dropdownRef}>
            <span
              onClick={toggleDropdown}
              style={{
                ...styles.link,
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundColor: dropdownOpen ? '#0d6efd' : 'transparent',
                padding: '4px 8px',
                borderRadius: 4,
                transition: 'background-color 0.3s',
              }}
            >
              Admin Dashboard
            </span>

            {dropdownOpen && (
              <div
                style={styles.dropdownMenu}
              >
               <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/books"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Librat (Admin)
</Link>
               <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/comments"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Komentet (Admin)
</Link>
               <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/genres"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Zhanret (Admin)
</Link>
                <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/purchases"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
> 
  Menaxho Blerjet (Admin)
</Link>
                <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/users"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Përdoruesit (Admin)
</Link>
                <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/emails"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Email-at (Admin)
</Link>
                <Link
  onClick={() => setDropdownOpen(false)}
  to="/admin/logs"
  style={{ ...styles.dropdownItem, fontSize: '14px' }}
>
  Menaxho Log-et (Admin)
</Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginLeft: 'auto' }}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ ...styles.link, marginRight: 15 }}>Login</Link>
            <Link to="/register" style={{ ...styles.button }}>Register</Link>
          </>
        ) : (
          <div onClick={handleLogout} style={{ ...styles.link, cursor: 'pointer', fontWeight: 'bold', color: 'white',marginRight: 75 }}>
            Log out
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    color: 'white',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 16,
    userSelect: 'none',
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
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    left: 0,
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.15)',
    borderRadius: 4,
    minWidth: 220,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownItem: {
    padding: '10px 15px',
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    userSelect: 'none',
  },
};

export default Navbar;
