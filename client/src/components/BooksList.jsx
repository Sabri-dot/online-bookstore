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

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="input-group" style={{ maxWidth: '500px', width: '100%' }}>
    <span className="input-group-text bg-light">
      <i className="fas fa-search"></i>
    </span>
    <input
      type="text"
      className="form-control"
      placeholder="Kërko titull ose autor..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

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

  useEffect(() => {
    fetch('http://localhost:5001/api/genres')
      .then(res => res.json())
      .then(data => setGenres(Array.isArray(data) ? data : []))
      .catch(() => toast.error('❌ Dështoi ngarkimi i zhanreve.'));
  }, []);

  useEffect(() => {
    const fetchBooks = selectedGenre === 'all' ? getBooks : () => getBooksByGenre(selectedGenre);
    fetchBooks()
      .then(res => setBooks(res.data))
      .catch(() => toast.error('❌ Dështoi ngarkimi i librave.'));
  }, [selectedGenre]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = books.filter(
      book =>
        book.title.toLowerCase().includes(lowerSearch) ||
        book.author.toLowerCase().includes(lowerSearch)
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5001/api/purchases/user-books', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPurchasedBookIds(data.map(b => b.id || b.book_id).map(Number)))
      .catch(() => toast.error('❌ Dështoi marrja e librave të blerë.'));
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
      toast.error('Libri nuk është i zgjedhur.');
      return;
    }
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

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📚 Librat në dispozicion</h2>

      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mb-4">
        <select
          className="form-select w-auto"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="all">Të gjitha zhanret</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="row g-4">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-muted">Nuk u gjet asnjë libër.</p>
        ) : (
          filteredBooks.map(book => {
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
                    <p
                      className="card-text text-truncate"
                      title={book.description}
                    >
                      {book.description}
                    </p>

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
