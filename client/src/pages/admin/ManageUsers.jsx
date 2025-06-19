import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api/admin/users';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // për editim ose shtim
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Gabim në marrjen e përdoruesve', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hap modal për shtim
  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setShowAddEditModal(true);
  };

  // Hap modal për editim me të dhënat e përdoruesit
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // password bosh për siguri
      role: user.role,
    });
    setShowAddEditModal(true);
  };

  // Hap modal për fshirje
  const [userToDelete, setUserToDelete] = useState(null);
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Konfirmo fshirjen
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Gabim gjatë fshirjes së përdoruesit', err);
    }
  };

  // Handle ndryshimet në form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit për shtim/editim
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (currentUser) {
        // Edito përdoruesin me PUT
        await axios.put(`${API_BASE}/${currentUser.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Shto përdorues të ri me POST
        await axios.post(API_BASE, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowAddEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Gabim gjatë ruajtjes së përdoruesit', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Menaxho Përdoruesit</h2>
      {/* Shto butonin thjesht me button dhe klasat bootstrap */}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={handleAddUser}
      >
        + Shto Përdorues
      </button>

      <table className="table table-striped table-bordered table-hover table-responsive">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edito
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteClick(user)}
                >
                  Fshi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal për shtim/editim */}
      <div
        className={`modal fade ${showAddEditModal ? 'show d-block' : ''}`}
        tabIndex="-1"
        aria-modal={showAddEditModal ? 'true' : undefined}
        role="dialog"
        style={showAddEditModal ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">{currentUser ? 'Edito Përdorues' : 'Shto Përdorues'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password {currentUser ? '(lëre bosh për të mos ndryshuar)' : ''}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    {...(!currentUser && { required: true })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Roli</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddEditModal(false)}
                >
                  Anulo
                </button>
                <button type="submit" className="btn btn-primary">
                  Ruaj
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal për fshirje */}
      <div
        className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`}
        tabIndex="-1"
        aria-modal={showDeleteModal ? 'true' : undefined}
        role="dialog"
        style={showDeleteModal ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}}
        onClick={() => setShowDeleteModal(false)}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Konfirmo Fshirjen</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>A jeni të sigurt që doni të fshini përdoruesin <strong>{userToDelete?.username}</strong>?</p>
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
                onClick={confirmDelete}
              >
                Fshi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
