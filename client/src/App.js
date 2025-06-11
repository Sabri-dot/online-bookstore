import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BooksList from './components/BooksList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route
            path="/add-book"
            element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;
