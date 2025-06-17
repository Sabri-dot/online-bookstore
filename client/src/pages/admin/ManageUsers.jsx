import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
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
      <Button variant="primary" className="mb-3" onClick={handleAddUser}>
        + Shto Përdorues
      </Button>

      <Table striped bordered hover responsive>
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
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edito
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(user)}
                >
                  Fshi
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal për shtim/editim */}
      <Modal show={showAddEditModal} onHide={() => setShowAddEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edito Përdorues' : 'Shto Përdorues'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password {currentUser ? '(lëre bosh për të mos ndryshuar)' : ''}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                {...(!currentUser && { required: true })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Roli</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddEditModal(false)}>
              Anulo
            </Button>
            <Button variant="primary" type="submit">
              Ruaj
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal për fshirje */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmo Fshirjen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>A jeni të sigurt që doni të fshini përdoruesin <strong>{userToDelete?.username}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Anulo
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Fshi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUsers;
