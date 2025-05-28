import React, { useState } from 'react';
import { addBook } from '../services/bookService';

const AddBook = () => {
  const token = localStorage.getItem('token'); // Merret direkt nga localStorage

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (!formData.title || !formData.author || !formData.price) {
      setError('Ju lutem plotësoni titullin, autorin dhe çmimin.');
      return false;
    }
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Çmimi duhet të jetë një numër pozitiv.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Duhet të jeni të kyçur për të shtuar libra.');
      return;
    }

    if (!validate()) return;

    addBook(formData, token)
      .then(() => {
        setSuccess('Libri u shtua me sukses!');
        setFormData({
          title: '',
          author: '',
          description: '',
          price: '',
        });
      })
      .catch(() => setError('Gabim gjatë shtimit të librit.'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Shto Libër të Ri</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input
        name="title"
        placeholder="Titulli"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        name="author"
        placeholder="Autori"
        value={formData.author}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Përshkrimi"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="price"
        placeholder="Çmimi"
        value={formData.price}
        onChange={handleChange}
      />
      <button type="submit">Shto</button>
    </form>
  );
};

export default AddBook;
