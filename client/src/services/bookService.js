// client/src/services/bookService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const getBooks = () => axios.get(`${API_BASE_URL}/books`);

export const getBookById = (id) => axios.get(`${API_BASE_URL}/books/${id}`);

export const getBooksByGenre = (genre) =>
  axios.get(`${API_BASE_URL}/books/genre/${encodeURIComponent(genre)}`);

export const addBook = (book, token) =>
  axios.post(`${API_BASE_URL}/books`, book, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateBook = (id, book, token) =>
  axios.put(`${API_BASE_URL}/books/${id}`, book, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteBook = (id, token) =>
  axios.delete(`${API_BASE_URL}/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
