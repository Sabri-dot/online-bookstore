import React from 'react';
import { FaFacebookF, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#222',
      color: '#fff',
      padding: '1rem 0',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#3b5998', margin: '0 1rem', fontSize: '1.5rem' }}>
          <FaFacebookF />
        </a>
        <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" style={{ color: '#25D366', margin: '0 1rem', fontSize: '1.5rem' }}>
          <FaWhatsapp />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#C13584', margin: '0 1rem', fontSize: '1.5rem' }}>
          <FaInstagram />
        </a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Libraria Online. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
};

export default Footer;