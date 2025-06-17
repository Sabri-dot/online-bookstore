import 'bootstrap/dist/css/bootstrap.min.css';
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
import PrivateRoute from './components/PrivateRoute'; // importojmë PrivateRoute
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageComments from './pages/admin/ManageComments';
import ManageGenres from './pages/admin/ManageGenres';
import ManagePurchases from './pages/admin/ManagePurchases';
import ManageUsers from './pages/admin/ManageUsers';
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<ManageBooks />} />
          <Route path="/admin/comments" element={<ManageComments />} />
          <Route path="/admin/genres" element={<ManageGenres />} />
          <Route path="/admin/purchases" element={<ManagePurchases />}/> 
         <Route path="/admin/users" element={<ManageUsers />} />
          {/* Shtojmë rruget private me kontroll role */}

          {/* Vetëm përdorues të kyçur mund të shtojnë libra */}
          <Route
            path="/add-book"
            element={
              <PrivateRoute>
                <AddBook />
              </PrivateRoute>
            }
          />

          {/* Shembull: Rruga e adminit për menaxhim librash */}
          <Route
            path="/admin/books"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                {/* Nëse nuk e ke faqen AdminBooks, krijo atë, ose shtoje komponentin që menaxhon librat nga admin */}
                <BooksList adminView={true} />
              </PrivateRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </Router>
  );
}

export default App;
