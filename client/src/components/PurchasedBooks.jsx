import React, { useEffect, useState } from 'react';

function PurchasedBooks() {
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`http://localhost:5001/api/purchases/${user.id}`)
      .then(res => res.json())
      .then(data => setPurchasedBooks(data))
      .catch(err => console.error('Gabim në marrjen e librave të blerë', err));
  }, []);

  if (purchasedBooks.length === 0) return <p>Nuk ke blerë ende libra.</p>;

  return (
    <div>
      <h2>Librat e blerë</h2>
      <ul>
        {purchasedBooks.map(book => (
          <li key={book.id}>{book.title} nga {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default PurchasedBooks;