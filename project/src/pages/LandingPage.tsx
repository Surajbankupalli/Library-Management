
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, UserCog, ArrowRight, BookOpenCheck, Clock, Search } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed w-full z-10">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">UniLibrary</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Gateway to <span className="text-indigo-600">Knowledge</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Access thousands of resources, manage your borrowings, and discover new knowledge through our university library system.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="#choose-role" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <img src="https://srmap.edu.in/wp-content/uploads/2022/12/international1.jpg" alt="Library illustration" className="rounded-xl shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Library Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-indigo-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <BookOpenCheck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy Borrowing</h3>
              <p className="text-gray-600">Browse and borrow from thousands of books, journals, and digital resources.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reservation System</h3>
              <p className="text-gray-600">Reserve books in advance and get notified when they're available.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Search className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
              <p className="text-gray-600">Find exactly what you need with our powerful search and filtering tools.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Role Section */}
      <div id="choose-role" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select how you'd like to access our library system
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-t-4 border-indigo-500 group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold ml-4">Student</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Access your student account to borrow books, check due dates, and manage your library activities.
              </p>
              <div className="space-y-4">
                <Link
                  to="/student/login"
                  className="flex items-center justify-center w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/student/signup"
                  className="flex items-center justify-center w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-t-4 border-purple-500 group">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <UserCog className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold ml-4">Administrator</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Manage library resources, handle student requests, and oversee library operations.
              </p>
              <div className="space-y-4">
                <Link
                  to="/admin/login"
                  className="flex items-center justify-center w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/admin/signup"
                  className="flex items-center justify-center w-full border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
<footer className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-indigo-400" />
          <span className="text-xl font-bold">UniLibrary</span>
        </div>
        <p className="mt-4 text-gray-400">
          Empowering students and faculty with accessible knowledge resources since 1995.
        </p>
      </div>
    </div>
    <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
      <p>© {new Date().getFullYear()} University Library. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default LandingPage;