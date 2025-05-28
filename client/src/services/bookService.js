// src/services/bookService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/books';

export const getBooks = () => axios.get(API_URL);

export const getBookById = (id) => axios.get(`${API_URL}/${id}`);

export const addBook = (book, token) =>
  axios.post(API_URL, book, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateBook = (id, book, token) =>
  axios.put(`${API_URL}/${id}`, book, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteBook = (id, token) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
