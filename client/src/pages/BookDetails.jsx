import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../services/bookService';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookById(id)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Libri nuk u gjet.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}>
      <img
        src={book.image_url || 'https://i.imgur.com/qIW4AsM.jpg'}
        alt={book.title}
        style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 6, marginBottom: 16 }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://i.imgur.com/qIW4AsM.jpg';
        }}
      />
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Price:</strong> ${book.price.toFixed(2)} USD</p>

      <Link to="/books" style={{ display: 'inline-block', marginTop: 20, color: '#1877F2', textDecoration: 'underline' }}>
        Kthehu në Listën e Librave
      </Link>
    </div>
  );
};

export default BookDetails;
