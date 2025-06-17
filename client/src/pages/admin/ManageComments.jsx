import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fusha për koment të ri
  const [newComment, setNewComment] = useState({
    userId: '',
    bookId: '',
    commentText: '',
    rating: 1,
    isAnonymous: false,
  });

  // Shtojmë shtetin për modalin e fshirjes
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/comments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      setError('Gabim gjatë marrjes së komenteve.');
      setLoading(false);
    }
  };

  // Kur klikohet butoni Fshij, hap modalin dhe ruaj id-në e komenti që do fshihet
  const confirmDelete = (id) => {
    setCommentToDelete(id);
    setShowDeleteModal(true);
  };

  // Fshirja reale pas konfirmimit
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/comments/${commentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(c => c._id !== commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (err) {
      alert('Gabim gjatë fshirjes së komentit.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.userId || !newComment.bookId || !newComment.commentText) {
      alert('Ju lutem plotësoni fushat User ID, Book ID dhe Komenti.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/admin/comments', newComment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([res.data, ...comments]);
      setNewComment({
        userId: '',
        bookId: '',
        commentText: '',
        rating: 1,
        isAnonymous: false,
      });
    } catch (err) {
      alert('Gabim gjatë shtimit të komentit.');
    }
  };

  if (loading) return <p>Duke ngarkuar komentet...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Menaxho Komentet (Admin)</h2>

      {/* Forma për Shtim Komenti */}
      <form onSubmit={handleAddComment} className="mb-5 p-4 border rounded bg-light">
        <h4>Shto Koment të Ri</h4>
        <div className="mb-3">
          <label className="form-label">User ID</label>
          <input
            type="text"
            className="form-control"
            name="userId"
            value={newComment.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Book ID</label>
          <input
            type="text"
            className="form-control"
            name="bookId"
            value={newComment.bookId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teksti i Komentit</label>
          <textarea
            className="form-control"
            name="commentText"
            value={newComment.commentText}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vlerësimi</label>
          <select
            className="form-select"
            name="rating"
            value={newComment.rating}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isAnonymous"
            name="isAnonymous"
            checked={newComment.isAnonymous}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="isAnonymous">Koment anonim</label>
        </div>
        <button type="submit" className="btn btn-primary">Shto Koment</button>
      </form>

      {/* Lista e komenteve */}
      {comments.length === 0 ? (
        <p>Nuk ka komente për t’u shfaqur.</p>
      ) : (
        <ul className="list-group">
          {comments.map(comment => (
            <li
              key={comment._id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div><strong>User ID:</strong> {comment.userId}</div>
                <div><strong>Book ID:</strong> {comment.bookId}</div>
                <div><strong>Teksti i Komentit:</strong> {comment.commentText}</div>
                <div><strong>Vlerësimi:</strong> {comment.rating}</div>
                <div><strong>Anonim:</strong> {comment.isAnonymous ? 'Po' : 'Jo'}</div>
                <div><small className="text-muted">Krijuar më: {new Date(comment.createdAt).toLocaleString()}</small></div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => confirmDelete(comment._id)}
                title="Fshij Komentin"
              >
                Fshij
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal për konfirmim fshirjeje */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ maxWidth: '400px', margin: 'auto' }}
          >
            <div className="modal-content p-3">
              <h5 className="modal-title">Konfirmimi i Fshirjes</h5>
              <p>A dëshironi të fshini këtë koment?</p>
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={handleCancelDelete}>Anulo</button>
                <button className="btn btn-danger" onClick={handleDelete}>Fshij</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComments;
