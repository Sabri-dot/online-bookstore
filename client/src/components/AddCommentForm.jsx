import React, { useState } from 'react';
import axios from 'axios';

const AddCommentForm = ({ bookId, userId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5001/api/comments', {
        userId,
        bookId,
        commentText,
        rating,
      });
      setCommentText('');
      setRating(5);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Gabim gjatë shtimit të komentit.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Shto Komentin Tënd</h3>
      <div>
        <textarea
          required
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Shkruaj koment këtu..."
        />
      </div>
      <div>
        <label>Vlerësimi:</label>
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Duke dërguar...' : 'Shto Komentin'}
      </button>
    </form>
  );
};

export default AddCommentForm;
