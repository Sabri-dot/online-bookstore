import React, { useEffect, useState } from 'react';
import { getBooks, getBooksByGenre } from '../services/bookService';
import PaymentModal from './PaymentModal';
import CommentsSection from './CommentsList';
import { toast } from 'react-toastify';
import { Howl } from 'howler';

const successSound = new Howl({
  src: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'],
  volume: 0.5,
});

const BooksList = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchasedBookIds, setPurchasedBookIds] = useState([]);
  const token = localStorage.getItem('token');

  const handleOpenPaymentModal = (book) => {
  console.log('Book selected for payment:', book);
  setSelectedBook(book);
  setShowModal(true);
};
  // Fetch genres from backend on mount
  useEffect(() => {
    fetch('http://localhost:5001/api/genres')
      .then(res => res.json())
      .then(data => setGenres(Array.isArray(data) ? data : []))
      .catch(() => toast.error('❌ Dështoi ngarkimi i zhanreve.'));
  }, []);

  // Fetch books when selectedGenre changes
  useEffect(() => {
    const fetchBooks = selectedGenre === 'all' ? getBooks : () => getBooksByGenre(selectedGenre);
    fetchBooks()
      .then(res => setBooks(res.data))
      .catch(() => toast.error('❌ Dështoi ngarkimi i librave.'));
  }, [selectedGenre]);

  // Filter books based on search term
  useEffect(() => {
    const search = searchTerm.toLowerCase();
    const filtered = books.filter(
      book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  // Fetch purchased books for the logged in user
  useEffect(() => {
    if (token) {
      fetch('http://localhost:5001/api/purchases/user-books', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          // Map book IDs from response - assuming API returns an array of book objects with id or book_id
          const ids = data.map(b => b.id || b.book_id).map(Number);
          setPurchasedBookIds(ids);
        })
        .catch(() => toast.error('❌ Dështoi marrja e librave të blerë.'));
    }
  }, [token]);

  const handleBuyClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleConfirmPayment = async (paymentInfo) => {
  if (!token) {
    toast.warning('🔒 Ju lutemi kyçuni për të bërë blerje.');
    return;
  }

  if (!selectedBook || !selectedBook.id) {
    toast.error('Libri nuk është i zgjedhur ose nuk ka ID të vlefshme.');
    return;
  }

  console.log('Selected book:', selectedBook);

  try {
    const res = await fetch('http://localhost:5001/api/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: selectedBook.id }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      toast.error(data?.message || '❌ Dështoi blerja.');
    } else {
      toast.success('✅ Blerja u krye me sukses!');
      successSound.play();
      setShowModal(false);
      setSelectedBook(null);
      setPurchasedBookIds(prev => [...prev, selectedBook.id]);
    }
  } catch {
    toast.error('❌ Gabim gjatë lidhjes me serverin.');
  }
};
  const purchasedBooks = books.filter(b => purchasedBookIds.includes(b.id));

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📚 Librat në dispozicion</h2>

      <div className="d-flex justify-content-center align-items-center mb-4 gap-3 flex-wrap">
        <select
          className="form-select w-auto"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="all">Të gjitha zhanret</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-light">
            <i className="fas fa-book"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Kërko sipas titullit ose autorit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-muted">Nuk u gjet asnjë libër.</p>
        ) : (
          filteredBooks.map((book) => {
            const isPurchased = purchasedBookIds.includes(book.id);
            return (
              <div key={book.id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={book.image_url}
                    className="card-img-top"
                    alt={book.title}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text"><strong>Autori:</strong> {book.author}</p>
                    <p className="card-text"><strong>Çmimi:</strong> {book.price} €</p>
                    <p className="card-text text-truncate" title={book.description}>{book.description}</p>

                    {!isPurchased ? (
                      <button
                        className="btn btn-success mt-auto"
                        onClick={() => handleBuyClick(book)}
                      >
                        <i className="fas fa-cart-shopping me-2"></i> Bli
                      </button>
                    ) : (
                      <button className="btn btn-secondary mt-auto" disabled>
                        <i className="fas fa-check me-2"></i> E blerë
                      </button>
                    )}

                    <CommentsSection bookId={book.id} isPurchased={isPurchased} token={token} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {purchasedBooks.length > 0 && (
        <div className="mt-5">
          <h3>
            <i className="fas fa-check-circle text-success me-2"></i> Librat e blerë
          </h3>
          <ul className="list-group mt-3">
            {purchasedBooks.map((book) => (
              <li
                key={book.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{book.title}</strong> nga {book.author}
                </div>
                <span className="badge bg-success rounded-pill">{book.price} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && selectedBook && (
        <PaymentModal
          book={selectedBook}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default BooksList;
