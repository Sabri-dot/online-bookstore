import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    book_id: '',
    purchase_date: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPurchases();
    fetchBooks();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/purchases', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases(res.data);
      setError('');
    } catch {
      setError('Gabim gjatë marrjes së blerjeve');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch {
      console.error('Gabim gjatë marrjes së librave');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'book_id') {
        const selectedBook = books.find(book => String(book.id) === value);
        if (selectedBook) {
          const priceNum = parseFloat(selectedBook.price);
          updated.price = !isNaN(priceNum) ? priceNum.toFixed(2) : '';
        } else {
          updated.price = '';
        }
      }
      return updated;
    });
  };

  const handleAddOrEditPurchase = async e => {
    e.preventDefault();
    const { user_id, book_id, purchase_date } = formData;
    if (!user_id || !book_id || !purchase_date) {
      setError('Ju lutem plotësoni të gjitha fushat e nevojshme');
      return;
    }

    const dataToSend = {
      user_id,
      book_id,
      purchase_date,
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/purchases/${editId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setError('');
        setEditId(null);
      } else {
        await axios.post('/api/admin/purchases', dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setError('');
      }

      setFormData({ user_id: '', book_id: '', purchase_date: '', price: '' });
      fetchPurchases();
    } catch {
      setError('Gabim gjatë shtimit ose përditësimit të blerjes');
    }
  };

  const openDeleteModal = id => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/admin/purchases/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError('');
      closeDeleteModal();
      fetchPurchases();
    } catch {
      setError('Gabim gjatë fshirjes së blerjes');
    }
  };

  const handleEditClick = purchase => {
    const selectedBook = books.find(book => String(book.id) === String(purchase.book_id));
    const priceNum = selectedBook ? parseFloat(selectedBook.price) : NaN;
    setEditId(purchase.id);
    setFormData({
      user_id: purchase.user_id || '',
      book_id: purchase.book_id || '',
      purchase_date: purchase.purchase_date ? purchase.purchase_date.slice(0, 16) : '',
      price: !isNaN(priceNum) ? priceNum.toFixed(2) : '',
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Menaxho Blerjet (Purchases)</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddOrEditPurchase} className="mb-5">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label htmlFor="user_id" className="form-label">
              User ID
            </label>
            <input
              type="number"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              className="form-control"
              placeholder="ID e përdoruesit"
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="book_id" className="form-label">
              Book ID
            </label>
            <input
              type="number"
              id="book_id"
              name="book_id"
              value={formData.book_id}
              onChange={handleInputChange}
              className="form-control"
              placeholder="ID e librit"
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="price" className="form-label">
              Çmimi (€)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              readOnly
              className="form-control"
              placeholder="Çmimi në €"
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="purchase_date" className="form-label">
              Data e Blerjes
            </label>
            <input
              type="datetime-local"
              id="purchase_date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-12 d-grid mt-3">
            <button type="submit" className="btn btn-success btn-lg">
              {editId ? 'Ruaj Ndryshimet' : 'Shto Blerje'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
          <span className="ms-2">Duke ngarkuar...</span>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Title</th>
                <th>Price (€)</th>
                <th>Data Blerjes</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    Nuk ka blerje për të shfaqur
                  </td>
                </tr>
              )}
              {purchases.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.user_email}</td>
                  <td>{p.book_title}</td>
                  <td>{p.price != null ? Number(p.price).toFixed(2) : '0.00'}</td>
                  <td>{new Date(p.purchase_date).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() =>
                        handleEditClick({
                          id: p.id,
                          user_id: p.user_id || '',
                          book_id: p.book_id || '',
                          purchase_date: p.purchase_date,
                          price: p.price,
                        })
                      }
                      title="Edito Blerjen"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openDeleteModal(p.id)}
                      title="Fshi Blerjen"
                    >
                      Fshi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeDeleteModal}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Konfirmim Fshirjeje</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>A jeni i sigurt që dëshironi të fshini këtë blerje?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                  Anulo
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Fshi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePurchases;
