import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UploadPdf from './UploadPdf';

function BookDetails() {
  const { id: bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // ose nga ku e ke token-in

  useEffect(() => {
    // Merr detajet e librit nga API-ja
    fetch(`/api/books/${bookId}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gabim gjatë marrjes së librit:', err);
        setLoading(false);
      });
  }, [bookId]);

  if (loading) {
    return <p>Duke ngarkuar detajet e librit...</p>;
  }

  if (!book) {
    return <p>Libri nuk u gjet.</p>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Autor: {book.author}</p>
      <p>Çmimi: {book.price} €</p>
      <p>Përshkrimi: {book.description}</p>

      {/* Komponenti për ngarkimin e PDF */}
      <UploadPdf bookId={bookId} token={token} />
    </div>
  );
}

export default BookDetails;
