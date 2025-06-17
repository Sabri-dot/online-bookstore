import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const cardStyle = {
    padding: '20px',
    margin: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: '200px',
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '40px',
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Paneli i Administratorit</h2>
      <div style={containerStyle}>
        <Link to="/admin/books" style={cardStyle}>Menaxho Librat</Link>
        <Link to="/admin/comments" style={cardStyle}>Menaxho Komentet</Link>
        <Link to="/admin/genres" style={cardStyle}>Menaxho Zhanret</Link>
        <Link to="/admin/users" style={cardStyle}>Menaxho Përdoruesit</Link>
        <Link to="/admin/purchases" style={cardStyle}>Menaxho Blerjet</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;