import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    id: null,          // id e blerjes për editim
    user_id: '',
    book_id: '',
    price: '',
    purchase_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/purchases', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(res.data);
      setError('');
    } catch (err) {
      setError('Gabim gjatë marrjes së blerjeve');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrUpdatePurchase = async e => {
    e.preventDefault();

    if (!formData.user_id || !formData.book_id || !formData.price || !formData.purchase_date) {
      setError('Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    try {
      if (isEditing) {
        // Update
        await axios.put(`/api/admin/purchases/${formData.id}`, {
          user_id: formData.user_id,
          book_id: formData.book_id,
          price: formData.price,
          purchase_date: formData.purchase_date,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setError('');
        setIsEditing(false);
      } else {
        // Create new
        await axios.post('/api/admin/purchases', {
          user_id: formData.user_id,
          book_id: formData.book_id,
          price: formData.price,
          purchase_date: formData.purchase_date,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setError('');
      }

      setFormData({
        id: null,
        user_id: '',
        book_id: '',
        price: '',
        purchase_date: ''
      });
      fetchPurchases();
    } catch (err) {
      setError('Gabim gjatë ruajtjes së blerjes.');
    }
  };

  const openDeleteModal = (id) => {
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
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('');
      closeDeleteModal();
      fetchPurchases();
    } catch (err) {
      setError('Gabim gjatë fshirjes së blerjes');
    }
  };

  // Funksioni për hapjen e formës edit
  const handleEditClick = (purchase) => {
    setIsEditing(true);
    setFormData({
      id: purchase.id,
      user_id: purchase.user_id || '',  // këto nuk kthehen nga backend, do i mbash bosh ose mund t’i marrësh ndryshe
      book_id: purchase.book_id || '',
      price: purchase.price || '',
      purchase_date: purchase.purchase_date ? purchase.purchase_date.slice(0, 10) : '', // format YYYY-MM-DD për input date
    });
    setError('');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Menaxho Blerjet (Purchases)</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddOrUpdatePurchase} className="mb-5">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label htmlFor="user_id" className="form-label">User ID</label>
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
            <label htmlFor="book_id" className="form-label">Book ID</label>
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
          <div className="col-md-2">
            <label htmlFor="price" className="form-label">Çmimi (€)</label>
            <input
              type="number"
              step="0.01"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Çmimi në €"
              required
            />
          </div>
          <div className="col-md-2">
            <label htmlFor="purchase_date" className="form-label">Data Blerjes</label>
            <input
              type="date"
              id="purchase_date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-2 d-grid">
            <button type="submit" className={`btn btn-${isEditing ? 'warning' : 'success'} btn-lg`}>
              {isEditing ? 'Ruaj Ndryshimet' : 'Shto Blerje'}
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
                <th>User Email</th>
                <th>Book Title</th>
                <th>Data Blerjes</th>
                <th>Çmimi (€)</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Nuk ka blerje për të shfaqur</td>
                </tr>
              ) : (
                purchases.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.user_email}</td>
                    <td>{p.book_title}</td>
                    <td>{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : ''}</td>
                    <td>{p.price != null && !isNaN(p.price) ? Number(p.price).toFixed(2) : '0.00'} €</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(p)}
                        title="Edito Blerjen"
                      >
                        Edito
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Fshirjeje */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-modal="true"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeDeleteModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={e => e.stopPropagation()}
          >
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
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
