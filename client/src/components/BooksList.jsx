import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import { Link } from 'react-router-dom';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooks()
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading books');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Lista e Librave</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.title} — {book.author}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-book">Shto Libër të Ri</Link>
    </div>
  );
};

export default BooksList;
