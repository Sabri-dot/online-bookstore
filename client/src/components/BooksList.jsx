import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import { Link } from 'react-router-dom';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooks()
      .then(res => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Gabim në marrjen e librave.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading librat...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Libra në Shitje</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {books.map(book => (
          <div
            key={book.id}
            style={{
              width: 200,
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 16,
              textAlign: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={book.image_url}
              alt={book.title}
              style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 4 }}
            />
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
           <p>Çmimi: ${book.price ? Number(book.price).toFixed(2) : 'N/A'}</p>


            <Link to={`/books/${book.id}`} style={{ display: 'block', margin: '12px 0' }}>
              Detaje
            </Link>

            <button
              onClick={() => alert(`Shto në shportë: ${book.title}`)}
              style={{
                padding: '8px 12px',
                background: '#1877F2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Shto në Shportë
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksList;
