import React, { useState } from 'react';

const SearchBar = ({ books, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    // Filtrimi i librave sipas titullit dhe autorit, pa ndryshuar librat origjinalë
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(q.toLowerCase()) ||
      book.author.toLowerCase().includes(q.toLowerCase())
    );
    onSearch(filteredBooks);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Kërko librat sipas titullit ose autorit..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
