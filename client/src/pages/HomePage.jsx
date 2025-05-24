import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
  <h1 className="text-4xl font-bold text-blue-600 text-center mt-10">
    Welcome to the Online Bookstore 📚
  </h1>
  <p className="text-center text-gray-600 mt-2">
    Discover your next great read with us!
  </p>
</header>


      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="books-grid">
          {/* Këtu do vendosim librat më të spikatur */}
          <div className="book-card">
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" alt="Book 1" />
            <h3>The Great Gatsby</h3>
            <p>By F. Scott Fitzgerald</p>
          </div>
          <div className="book-card">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794" alt="Book 2" />
            <h3>1984</h3>
            <p>By George Orwell</p>
          </div>
          <div className="book-card">
            <img src="https://images.unsplash.com/photo-1528207776546-365bb710ee93" alt="Book 3" />
            <h3>To Kill a Mockingbird</h3>
            <p>By Harper Lee</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <p>We offer a huge collection of books, easy ordering, and fast delivery right to your door.</p>
      </section>
    </div>
  );
};

export default HomePage;
