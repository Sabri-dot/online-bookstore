import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentsList = ({ bookId, isPurchased, token, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [addingComment, setAddingComment] = useState(false);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  const fetchComments = async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/comments/${bookId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Gabim gjatë marrjes së komenteve:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchComments();

    setCommentText('');
    setRating(5);
    setIsAnonymous(false);
    setDisplayName('');
    setEditingCommentId(null);
    setError('');
  }, [bookId]);

  useEffect(() => {
    if (showComments && bookId) {
      fetchComments(); // ky është shtimi i vetëm që bëra
    }
  }, [showComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError('Ju lutem shkruani koment.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Vlerësimi duhet të jetë nga 1 deri në 5.');
      return;
    }
    if (!isAnonymous && displayName.trim() === '') {
      setError('Ju lutem shkruani emrin tuaj ose aktivizoni anonimitetin.');
      return;
    }

    setError('');
    setAddingComment(true);

    try {
      const commentData = {
        bookId,
        commentText,
        rating,
        isAnonymous,
        displayName: isAnonymous ? '' : displayName.trim(),
      };

      let res;
      if (editingCommentId) {
        res = await axios.put(
          `http://localhost:5001/api/comments/${editingCommentId}`,
          commentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setComments((prev) =>
          prev.map((c) => (c._id === editingCommentId ? res.data.comment : c))
        );
        setEditingCommentId(null);
      } else {
        res = await axios.post(
          'http://localhost:5001/api/comments',
          commentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments((prev) => [...prev, res.data.comment]);
      }

      setCommentText('');
      setRating(5);
      setIsAnonymous(false);
      setDisplayName('');
    } catch (err) {
  console.error('Gabim gjatë shtimit/editimit të komentit:', err);
  console.log('Error response:', err.response?.data);
  setError(
    err.response?.data?.message ||
    'Gabim gjatë dërgimit të komentit.'
  );
    } finally {
      setAddingComment(false);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setCommentText(comment.commentText || '');
    setRating(comment.rating || 5);
    setIsAnonymous(comment.isAnonymous || false);
    setDisplayName(comment.displayName || '');
    setError('');
  };

  const onMouseEnter = () => setShowComments(true);
  const onMouseLeave = () => setShowComments(false);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}
      className="comments-section"
    >
      <h3>Komente</h3>

      {!showComments && (
        <p style={{ fontStyle: 'italic', color: '#777' }}>
          Vendosni maus mbi librin për të parë komentet.
        </p>
      )}

      {showComments && (
        <>
          {loading && <p>Duke ngarkuar komentet...</p>}

          {!loading && comments.length === 0 && <p>Nuk ka komente për këtë libër.</p>}

          <ul className="list-group mb-3">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <strong>
                    {comment.isAnonymous
                      ? 'Përdorues Anonim'
                      : comment.displayName && comment.displayName.trim() !== ''
                      ? comment.displayName
                      : currentUser && comment.userId && currentUser._id === comment.userId._id
                      ? currentUser.name || 'Pa Emër'
                      : 'Pa Emër'}
                    :
                  </strong>{' '}
                  {comment.commentText}
                  <br />
                  <em>Vlerësimi: {comment.rating || 'Nuk është dhënë'} / 5</em>
                </div>

                {isPurchased && currentUser && comment.userId && currentUser._id === comment.userId._id && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditClick(comment)}
                  >
                    Edito
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isPurchased ? (
            <form onSubmit={handleSubmit}>
              <h4>{editingCommentId ? 'Edito koment' : 'Shto një koment'}</h4>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Shkruani komentun tuaj këtu..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={addingComment}
                />
              </div>

              <div className="mb-3">
                <label className="form-label me-2">Vlerësimi:</label>
                <select
                  className="form-select d-inline-block w-auto"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  disabled={addingComment}
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={addingComment}
                />
                <label className="form-check-label" htmlFor="anonymousCheck">
                  Komento si përdorues anonim
                </label>
              </div>

              {!isAnonymous && (
                <div className="mb-3">
                  <label className="form-label">Emri i komentuesit (opsional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Shkruaj emrin që do të shfaqet (ose lëre bosh)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={addingComment}
                  />
                </div>
              )}

              {error && <p className="text-danger">{error}</p>}

              <button
                type="submit"
                className="btn btn-success"
                disabled={addingComment}
              >
                {addingComment
                  ? 'Duke dërguar...'
                  : editingCommentId
                  ? 'Ruaj ndryshimet'
                  : 'Shto koment'}
              </button>

              {editingCommentId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEditingCommentId(null);
                    setCommentText('');
                    setRating(5);
                    setIsAnonymous(false);
                    setDisplayName('');
                    setError('');
                  }}
                  disabled={addingComment}
                >
                  Anulo
                </button>
              )}
            </form>
          ) : (
            <p className="fst-italic text-muted">
              🛒 Duhet të blini librin për të shtuar komente.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsList;
