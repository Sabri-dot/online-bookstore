import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    book_id: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleAddPurchase = async e => {
    e.preventDefault();
    if (!formData.user_id || !formData.book_id || !formData.amount) {
      setError('Ju lutem plotësoni të gjitha fushat e nevojshme');
      return;
    }
    try {
      await axios.post('/api/admin/purchases', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setError('');
      setFormData({ user_id: '', book_id: '', amount: '' });
      fetchPurchases();
    } catch (err) {
      setError('Gabim gjatë shtimit të blerjes');
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Menaxho Blerjet (Purchases)</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddPurchase} className="mb-5">
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
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="amount" className="form-label">Shuma (€)</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Shuma në €"
            />
          </div>
          <div className="col-md-3 d-grid">
            <button type="submit" className="btn btn-success btn-lg">Shto Blerje</button>
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
                <th>Shuma (€)</th>
                <th>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">Nuk ka blerje për të shfaqur</td>
                </tr>
              )}
              {purchases.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.user_email}</td>
                  <td>{p.book_title}</td>
                  <td>{new Date(p.purchase_date).toLocaleString()}</td>
                  <td>{p.price != null && !isNaN(p.price) ? Number(p.price).toFixed(2) : '0.00'} €</td>
                  <td>
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
