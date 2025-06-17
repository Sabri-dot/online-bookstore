import React, { useEffect, useState } from 'react';

// Modal i konfirmimit për fshirje
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: 320,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <p style={{ marginBottom: 20, fontSize: 16 }}>{message}</p>
      <button
        onClick={onCancel}
        style={{
          marginRight: 10,
          padding: '8px 16px',
          borderRadius: 4,
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Anulo
      </button>
      <button
        onClick={onConfirm}
        style={{
          padding: '8px 16px',
          borderRadius: 4,
          border: 'none',
          backgroundColor: '#e74c3c',
          color: 'white',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Fshi
      </button>
    </div>
  </div>
);

// Modal për Shto/Edit libër
const BookModal = ({ show, onClose, onSave, initialData, genres }) => {
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    author: '',
    price: '',
    genre: '',
    image_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        title: initialData.title || '',
        author: initialData.author || '',
        price: initialData.price || '',
        genre: initialData.genre_id || '',
        image_url: initialData.image_url || '',
      });
    } else {
      // Reset form kur hap modal për shtim të ri
      setFormData({
        id: null,
        title: '',
        author: '',
        price: '',
        genre: '',
        image_url: '',
      });
    }
  }, [initialData, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price || !formData.genre) {
      alert('Ju lutem plotësoni të gjitha fushat e detyrueshme.');
      return;
    }
    onSave(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          width: 400,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>{formData.id ? 'Edito Liber' : 'Shto Liber'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label>Titulli*:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{ width: '100%', padding: 6 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Autori*:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              style={{ width: '100%', padding: 6 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Çmimi (€)*:</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              style={{ width: '100%', padding: 6 }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Zhanri*:</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              style={{ width: '100%', padding: 6 }}
              required
            >
              <option value="">-- Zgjidh Zhanrin --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Link imazhi (image_url):</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://..."
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginRight: 10,
                padding: '8px 16px',
                borderRadius: 4,
                border: '1px solid #ccc',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Anulo
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 4,
                border: 'none',
                backgroundColor: '#2ecc71',
                color: 'white',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Ruaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);

  // Modal fshirje
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Modal shto/edito libër
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Nxjerr librat nga backend
  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5001/api/admin/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gabim gjatë marrjes së librave');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  // Nxjerr zhanret nga backend
 const fetchGenres = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5001/api/admin/genres', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Gabim gjatë marrjes së zhanreve');
    const data = await res.json();
    setGenres(data);
  } catch (err) {
    alert(err.message);
  }
};


  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  // Hap modal për fshirje
  const handleDeleteClick = (id) => {
    setBookToDelete(id);
    setShowConfirm(true);
  };

  // Konfirmo fshirjen
  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5001/api/admin/books/${bookToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBooks(books.filter((book) => book.id !== bookToDelete));
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Fshirja dështoi.');
      }
    } catch {
      alert('Gabim gjatë lidhjes me serverin.');
    }
    setShowConfirm(false);
    setBookToDelete(null);
  };

  // Anulo fshirjen
  const cancelDelete = () => {
    setShowConfirm(false);
    setBookToDelete(null);
  };

  // Hap modal shto libër
  const openAddModal = () => {
    setBookToEdit(null);
    setShowBookModal(true);
  };

  // Hap modal edito libër
  const openEditModal = (book) => {
    setBookToEdit(book);
    setShowBookModal(true);
  };

  // Ruaj libër (POST për shtim, PUT për editim)
  const saveBook = async (formData) => {
    const token = localStorage.getItem('token');
    try {
      let res;
      if (formData.id) {
        // Edit
        res = await fetch(`http://localhost:5001/api/admin/books/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            price: formData.price,
            genre_id: formData.genre,
            image_url: formData.image_url,
          }),
        });
      } else {
        // Shto
        res = await fetch(`http://localhost:5001/api/admin/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            price: formData.price,
            genre_id: formData.genre,
            image_url: formData.image_url,
          }),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Gabim gjatë ruajtjes së librit.');
        return;
      }

      // Rifresko librat
      fetchBooks();
      setShowBookModal(false);
      setBookToEdit(null);
    } catch {
      alert('Gabim gjatë lidhjes me serverin.');
    }
  };

  if (loading) {
    return <div>Duke ngarkuar librat...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Menaxho Librat</h2>
      <button
        onClick={openAddModal}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '10px 18px',
          borderRadius: 5,
          cursor: 'pointer',
          marginBottom: 15,
          fontSize: 16,
        }}
        onMouseEnter={e => (e.target.style.backgroundColor = '#2980b9')}
        onMouseLeave={e => (e.target.style.backgroundColor = '#3498db')}
      >
        + Shto Liber
      </button>

      {books.length === 0 ? (
        <p>Nuk ka libra për të shfaqur.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <thead style={{ backgroundColor: '#eee' }}>
            <tr>
              <th>ID</th>
              <th>Titulli</th>
              <th>Autori</th>
              <th>Çmimi (€)</th>
              <th>Zhanri</th>
              <th>Foto</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} style={{ cursor: 'default' }}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.price} €</td>
                <td>{book.genre || '-'}</td>
                <td>
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }}
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <button
                    onClick={() => openEditModal(book)}
                    style={{
                      backgroundColor: '#f39c12',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: 8,
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#d78e0e')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#f39c12')}
                  >
                    Edito
                  </button>
                  <button
                    onClick={() => handleDeleteClick(book.id)}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#c0392b')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#e74c3c')}
                  >
                    Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modalat */}
      {showConfirm && (
        <ConfirmModal
          message="A jeni i sigurt që dëshironi të fshini këtë libër?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <BookModal
        show={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSave={saveBook}
        initialData={bookToEdit}
        genres={genres}
      />
    </div>
  );
};

export default ManageBooks;
