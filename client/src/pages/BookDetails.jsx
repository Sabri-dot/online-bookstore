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
      .then((res) => {
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
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      <p>Price: {book.price} USD</p>
      
      {book.file_url && (
        <p>
          <a
            href={`http://localhost:5001/pdfs/${book.file_url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lexo PDF
          </a>
        </p>
      )}

      <Link to="/">Kthehu në Listën e Librave</Link>
    </div>
  );
};

export default BookDetails;
