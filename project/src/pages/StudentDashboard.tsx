import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Book, Clock, BookMarked, LogOut } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const currentTime = format(new Date(), 'h:mm a');
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const [reservedBooksCount, setReservedBooksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const firstName = localStorage.getItem('studentFirstName') || 'Student';

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const userId = localStorage.getItem('studentId');
        if (!userId) {
          console.error('User not logged in');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/requests/userrequests/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user requests');
        }

        const data = await response.json();

        // Count borrowed books (approved and not returned)
        const borrowedBooks = data.filter(
          (request) => request.status === 'approved' && 
                      request.returnStatus !== 'returned' &&
                      request.purpose !== 'reserve'
        );
        setBorrowedBooksCount(borrowedBooks.length);

        // Count reserved books (with purpose=reserve and status=approved)
        const reservedBooks = data.filter(
          (request) => request.purpose === 'reserve' && 
                      request.status === 'approved'
        );
        setReservedBooksCount(reservedBooks.length);
      } catch (err) {
        console.error('Error fetching user requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();

    // Listen for book return updates
    const handleBorrowedUpdate = (event) => {
      if (
        event.detail &&
        event.detail.userId === localStorage.getItem('studentId') &&
        event.detail.returnStatus === 'returned'
      ) {
        setBorrowedBooksCount((prevCount) => Math.max(0, prevCount - 1));
      }
    };

    window.addEventListener('borrowedBooksUpdate', handleBorrowedUpdate);

    const interval = setInterval(fetchUserRequests, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('borrowedBooksUpdate', handleBorrowedUpdate);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentFirstName');
    // Redirect to landing page
    navigate('http://localhost:5173/');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const cards = [
    { title: 'Borrowed Books', count: borrowedBooksCount, icon: BookMarked, color: 'bg-green-500' },
    { title: 'Reserved Books', count: reservedBooksCount, icon: Clock, color: 'bg-purple-500' }
  ];

  const newArrivals = [
    {
      id: 1,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200',
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {firstName}</h1>
            <p className="text-gray-600">{currentDate} | {currentTime}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            
            
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className={`inline-block p-3 rounded-lg ${card.color} text-white mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : card.count}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Library Operating Hours</h2>
          <p className="text-gray-600">
            Monday to Saturday: 9AM to 7PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelLogout}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
