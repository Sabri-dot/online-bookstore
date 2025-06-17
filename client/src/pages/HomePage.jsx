import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // <-- Importo useNavigate
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const navigate = useNavigate();  // <-- Inicijalizo useNavigate

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/books/best-sellers')
      .then((res) => setBestSellers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Funksioni per redirect ne /books kur klikojme butonin
  const handleBuyNow = () => {
    navigate('/books');
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="hero-banner d-flex align-items-center text-white"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url('/banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '0 5%',
          minHeight: '80vh',
        }}
      >
        <div className="hero-text" style={{ flex: '1 1 60%' }}>
          <h5 className="text-uppercase mb-3">Welcome to Online Book Store</h5>
          <h1 className="display-4 fw-bold mb-4">Koleksion i ndryshëm i Librave</h1>
          <p className="lead mb-4">
            "A room without books is like a body without a soul. – Marcus Tullius Cicero"
          </p>
          <button
            className="btn btn-outline-light btn-lg hover-grow"
            onClick={handleBuyNow}  // <-- Shto event handler
          >
            BUY NOW
          </button>
        </div>

        {/* Foto në të djathtë me më shumë hapësirë dhe margin-left auto */}
        <div className="d-none d-md-block" style={{ flex: '0 0 auto', marginLeft: 'auto' }}>
          <img
            src="/th.jpg"
            alt="Hero Extra"
            className="img-fluid ms-4 hero-image-animated"
            style={{ maxHeight: '400px' }}  // e rritëm lartësinë këtu
          />
        </div>
      </div>

      {/* Seksioni Best Sellers */}
      <div className="container mt-5">
        <h3>Best Sellers</h3>
        <p className="text-muted">Librat më të shitur nga libraria jonë</p>
        <div className="row">
          {bestSellers.map((book, idx) => (
            <div className="col-md-2 mb-4" key={idx}>
              <div className="card h-100 shadow-sm">
                <img
                  src={book.cover_url || '/default-cover.jpg'}
                  className="card-img-top"
                  alt={book.title}
                />
                <div className="card-body">
                  <h6 className="card-title">{book.title}</h6>
                  <p className="text-muted small">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
