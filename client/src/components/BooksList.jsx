import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import PaymentModal from './PaymentModal';
import { toast } from 'react-toastify';
import { Howl } from 'howler';
import CommentsSection from './CommentsList';
import 'react-toastify/dist/ReactToastify.css';

const successSound = new Howl({
  src: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'],
  volume: 0.5,
});

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchasedBookIds, setPurchasedBookIds] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadBooks();
    if (token) loadPurchasedBooks();
  }, [token]);

  const loadBooks = () => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch(() => toast.error('❌ Dështoi ngarkimi i librave.'));
  };

  const loadPurchasedBooks = () => {
    fetch('http://localhost:5001/api/purchases/user-books', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Librat e blerë:", data);
        const purchasedIds = data.map(b => b.book_id);
        setPurchasedBookIds(purchasedIds);
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së librave të blerë:", error);
        toast.error('❌ Dështoi marrja e librave të blerë.');
      });
  };

  const handleBuyClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleConfirmPayment = async (paymentInfo) => {
    if (!token) {
      toast.warning('🔒 Ju lutemi kyçuni për të bërë blerje.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: selectedBook.id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        toast.error(data?.message || '❌ Dështoi blerja.');
      } else {
        toast.success('✅ Blerja u krye me sukses! 📘');
        successSound.play();
        setShowModal(false);
        setSelectedBook(null);
        loadPurchasedBooks();
      }
    } catch (error) {
      console.error('Gabim:', error);
      toast.error('❌ Gabim gjatë lidhjes me serverin.');
    }
  };

  return (
    <div className="books-container" style={styles.container}>
      <h2 style={styles.title}>📚 Librat në dispozicion</h2>
      <div style={styles.grid}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            <img src={book.image_url} alt={book.title} style={styles.image} />
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p><strong>Autori:</strong> {book.author}</p>
            <p><strong>Çmimi:</strong> {book.price} €</p>
            <p style={styles.description}>{book.description}</p>
            <button style={styles.button} onClick={() => handleBuyClick(book)}>🛒 Bli</button>

            {/* Shfaq komentet gjithmonë dhe forma për shtim vetëm për librat e blerë */}
            <CommentsSection
              bookId={book.id}
              isPurchased={purchasedBookIds.includes(Number(book.id))}
              token={token}
            />
          </div>
        ))}
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

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '12px',
    padding: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  bookTitle: {
    fontSize: '1.2rem',
    margin: '0.5rem 0',
  },
  description: {
    fontSize: '0.9rem',
    color: '#555',
  },
  button: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.3s',
  },
};

export default BooksList;
