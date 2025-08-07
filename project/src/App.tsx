import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BorrowedBooks from './pages/BorrowedBooks';

import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookCatalog from './pages/AdminBookCatalog';
import AdminBookManagement from './pages/AdminBookManagement';

import LandingPage from './pages/LandingPage';
import StudentSignup from './pages/StudentSignup';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import BookCatalog from './pages/BookCatalog';
import MyAccount from './pages/MyAccount';
import HelpSupport from './pages/HelpSupport';
import AdminMessages from './components/AdminMessages';
import UserMessages from './components/UserMessages';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect base path to landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/book-catalog" element={<AdminBookCatalog />} />
        <Route path="/admin/book-management" element={<AdminBookManagement />} />
        <Route path="/admin/messages" element={<AdminMessages />} />

        {/* Student Routes */}
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Shared Routes */}
        <Route path="/book-catalog" element={<BookCatalog />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/messages" element={<UserMessages />} />

        {/* New route for BorrowedBooks */}
        <Route path="/borrowed-books" element={<BorrowedBooks />} />

        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

