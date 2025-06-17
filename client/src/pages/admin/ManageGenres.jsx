import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editGenreId, setEditGenreId] = useState(null);
  const [editGenreName, setEditGenreName] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState(null);

  const fetchGenres = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Ju lutem identifikohuni.');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5001/api/admin/genres', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Sessioni juaj ka skaduar. Ju lutem identifikohuni përsëri.');
        window.location.href = '/login';
      } else {
        console.error('Gabim gjatë marrjes së zhanrave:', error);
      }
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    setErrorMsg('');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Ju lutem identifikohuni.');
      return;
    }
    if (!newGenre.trim()) {
      setErrorMsg('Zhanri nuk mund të jetë bosh.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5001/api/admin/genres',
        { name: newGenre.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGenre('');
      fetchGenres();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Sessioni juaj ka skaduar. Ju lutem identifikohuni përsëri.');
        window.location.href = '/login';
      } else {
        setErrorMsg('Gabim gjatë shtimit të zhanrit.');
        console.error('Gabim gjatë shtimit të zhanrit:', error);
      }
    }
  };

  const startEdit = (genre) => {
    setEditGenreId(genre.id);
    setEditGenreName(genre.name);
    setEditErrorMsg('');
  };

  const cancelEdit = () => {
    setEditGenreId(null);
    setEditGenreName('');
    setEditErrorMsg('');
  };

  const handleEditGenre = async () => {
    setEditErrorMsg('');
    if (!editGenreName.trim()) {
      setEditErrorMsg('Zhanri nuk mund të jetë bosh.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Ju lutem identifikohuni.');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5001/api/admin/genres/${editGenreId}`,
        { name: editGenreName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cancelEdit();
      fetchGenres();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Sessioni juaj ka skaduar. Ju lutem identifikohuni përsëri.');
        window.location.href = '/login';
      } else {
        setEditErrorMsg('Gabim gjatë përditësimit të zhanrit.');
        console.error('Gabim gjatë përditësimit të zhanrit:', error);
      }
    }
  };

  const confirmDelete = (genre) => {
    setGenreToDelete(genre);
    setShowDeleteModal(true);
  };

  const handleDeleteGenre = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Ju lutem identifikohuni.');
      return;
    }
    try {
      await axios.delete(`http://localhost:5001/api/admin/genres/${genreToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setGenreToDelete(null);
      fetchGenres();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Sessioni juaj ka skaduar. Ju lutem identifikohuni përsëri.');
        window.location.href = '/login';
      } else {
        alert('Gabim gjatë fshirjes së zhanrit.');
        console.error('Gabim gjatë fshirjes së zhanrit:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Menaxho Zhanret</h2>

      <div className="mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className={`form-control ${errorMsg ? 'is-invalid' : ''}`}
          placeholder="Shto zhanër të ri"
          value={newGenre}
          onChange={(e) => {
            setNewGenre(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
        />
        {errorMsg && (
          <div className="invalid-feedback">
            {errorMsg}
          </div>
        )}
      </div>
      <button className="btn btn-primary mb-4" onClick={handleAddGenre}>
        Shto Zhanër
      </button>

      <div style={{ overflowX: 'auto' }}>
        <table 
          className="table table-striped table-bordered" 
          style={{ 
            width: '100%', 
            fontSize: '1.15rem', 
            minWidth: '700px' 
          }}
        >
          <thead className="table-dark">
            <tr>
              <th style={{ width: '5%' }}>#</th>
              <th style={{ width: '75%' }}>Emri i Zhanrit</th>
              <th style={{ width: '20%' }}>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre, index) => (
              <tr key={genre.id}>
                <td>{index + 1}</td>
                <td>
                  {editGenreId === genre.id ? (
                    <>
                      <input
                        type="text"
                        className={`form-control ${editErrorMsg ? 'is-invalid' : ''}`}
                        value={editGenreName}
                        onChange={(e) => {
                          setEditGenreName(e.target.value);
                          if (editErrorMsg) setEditErrorMsg('');
                        }}
                      />
                      {editErrorMsg && (
                        <div className="invalid-feedback">{editErrorMsg}</div>
                      )}
                    </>
                  ) : (
                    genre.name
                  )}
                </td>
                <td>
                  {editGenreId === genre.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={handleEditGenre}>
                        Ruaj
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                        Anulo
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(genre)}>
                        Edito
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(genre)}>
                        Fshij
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal për konfirmimin e fshirjes */}
      {showDeleteModal && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmo Fshirjen</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>A jeni të sigurt që dëshironi të fshini zhanrin <strong>{genreToDelete?.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Anulo
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteGenre}
                >
                  Fshij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGenres;
