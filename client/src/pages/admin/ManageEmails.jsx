import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api/admin/contact';

const ManageEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // id për konfirmim fshirje

  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    companyName: '',
    location: '',
    phone: '',
    email: '',
    areaOfContact: '',
    otherArea: '',
    message: '',
    applyToPartner: false,
  });

  const token = localStorage.getItem('token');
  const successTimeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmails(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Nuk je i autorizuar. Hyrje e nevojshme.');
      } else {
        setError('Gabim gjatë marrjes së emaileve.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();

    // pas 5 sekondash fsheh mesazhet automatikisht
    return () => {
      clearTimeout(successTimeoutRef.current);
      clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  const clearMessagesAfterDelay = () => {
    clearTimeout(successTimeoutRef.current);
    clearTimeout(errorTimeoutRef.current);

    successTimeoutRef.current = setTimeout(() => setSuccessMsg(''), 5000);
    errorTimeoutRef.current = setTimeout(() => setError(''), 5000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (email) => {
    setFormData({
      id: email.id,
      fullName: email.fullName || '',
      companyName: email.companyName || '',
      location: email.location || '',
      phone: email.phone || '',
      email: email.email || '',
      areaOfContact: email.areaOfContact || '',
      otherArea: email.otherArea || '',
      message: email.message || '',
      applyToPartner: email.applyToPartner || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // me scroll në form
  };

  // kur klikon fshi, shfaq formularin per konfirmim brenda faqes
  const requestDelete = (id) => {
    setConfirmDeleteId(id);
  };

  // anulo fshirjen
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // fshi pasi e konfirmon ne faqen
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Emaili u fshi me sukses.');
      setConfirmDeleteId(null);
      fetchEmails();
      clearMessagesAfterDelay();
    } catch (err) {
      setError('Gabim gjatë fshirjes së emailit.');
      clearMessagesAfterDelay();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${API_BASE}/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Emaili u përditësua me sukses.');
      } else {
        await axios.post(API_BASE, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg('Emaili u krijua me sukses.');
      }
      setFormData({
        id: null,
        fullName: '',
        companyName: '',
        location: '',
        phone: '',
        email: '',
        areaOfContact: '',
        otherArea: '',
        message: '',
        applyToPartner: false,
      });
      fetchEmails();
      clearMessagesAfterDelay();
    } catch (err) {
      setError('Gabim gjatë ruajtjes së emailit.');
      clearMessagesAfterDelay();
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Menaxhimi i Email-eve të Kontaktit</h2>

      {/* Alert për sukses */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMsg}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {/* Alert për gabim */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setError('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status" aria-hidden="true"></div>
          <span className="ms-2">Duke ngarkuar...</span>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Emri</th>
                  <th>Emri i Kompanisë</th>
                  <th>Lokacioni</th>
                  <th>Numri i Tel.</th>
                  <th>Email</th>
                  <th>Area e Kontaktit</th>
                  <th>Mesazhi</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">Nuk ka email-e për t’u shfaqur.</td>
                  </tr>
                ) : (
                  emails.map(email => (
                    <tr key={email.id}>
                      <td>{email.fullName}</td>
                      <td>{email.companyName || '-'}</td>
                      <td>{email.location || '-'}</td>
                      <td>{email.phone || '-'}</td>
                      <td>{email.email}</td>
                      <td>{email.areaOfContact}</td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{email.message || '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(email)}>Edito</button>

                        {/* Ketu nese klikohen fshi shfaqet buton per konfirmim */}
                        {confirmDeleteId === email.id ? (
                          <>
                            <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(email.id)}>Konfirmo Fshirjen</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelDelete}>Anulo</button>
                          </>
                        ) : (
                          <button className="btn btn-sm btn-danger" onClick={() => requestDelete(email.id)}>Fshi</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h4>{formData.id ? 'Përditëso Email' : 'Shto Email të Ri'}</h4>
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Emri i Plotë *</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="companyName" className="form-label">Emri i Kompanisë</label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">Lokacioni</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Numri i Tel.</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="areaOfContact" className="form-label">Area e Kontaktit *</label>
              <select
                id="areaOfContact"
                name="areaOfContact"
                className="form-select"
                value={formData.areaOfContact}
                onChange={handleChange}
                required
              >
                <option value="">Zgjidh një opsion</option>
                <option value="Support">Support</option>
                <option value="Sales">Sales</option>
                <option value="Partnership">Partnership</option>
                <option value="Other">Tjetër</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Mesazhi</label>
              <textarea
                id="message"
                name="message"
                className="form-control"
                rows="3"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success">
              {formData.id ? 'Përditëso' : 'Shto'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ManageEmails;
