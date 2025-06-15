import axios from 'axios';

const API_URL = 'http://localhost:5001/api/comments';

export const getCommentsByBook = (bookId) => {
  return axios.get(`${API_URL}/${bookId}`);
};

export const addComment = (commentData, token) => {
  return axios.post(API_URL, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editComment = (commentId, commentText, rating, isAnonymous, token) => {
  return axios.put(
    `${API_URL}`,
    { commentId, commentText, rating, isAnonymous },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
