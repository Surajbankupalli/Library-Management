import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen } from 'lucide-react';

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  borrowDate: string;
  dueDate: string;
  status: string;
  returnStatus?: string;
}

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBorrowedBooks = async () => {
    try {
      const userId = localStorage.getItem('studentId');
      if (!userId) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`http://localhost:5000/api/requests/userrequests/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch borrowed books');
      }

      const data = await response.json();

      // Filter only approved requests AND not returned books
      const approvedBooks = data
        .filter((request: any) => 
          request.status === 'approved' && 
          request.returnStatus !== 'returned' // Exclude returned books
        )
        .map((request: any) => ({
          id: request._id,
          title: request.bookTitle,
          author: request.bookId?.author || 'Unknown Author',
          cover: request.bookId?.cover || request.bookId?.image || '/default-book-cover.jpg',
          borrowDate: new Date(request.requestDate).toISOString().split('T')[0],
          dueDate: new Date(new Date(request.requestDate).getTime() + request.borrowDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: request.status,
          returnStatus: request.returnStatus
        }));

      setBorrowedBooks(approvedBooks);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
    
    // Listen for book return updates
    const handleBorrowedUpdate = (event: any) => {
      if (event.detail && 
          event.detail.userId === localStorage.getItem('studentId') && 
          event.detail.returnStatus === 'returned') {
        setBorrowedBooks(prevBooks => 
          prevBooks.filter(book => book.id !== event.detail.requestId)
        );
      }
    };
    
    window.addEventListener('borrowedBooksUpdate', handleBorrowedUpdate);
    
    const interval = setInterval(fetchBorrowedBooks, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('borrowedBooksUpdate', handleBorrowedUpdate);
    };
  }, []);
  

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading your borrowed books...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center mb-8">
          <BookOpen className="w-8 h-8 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Borrowed Books</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-48 object-cover"
                onError={(e) => { e.currentTarget.src = '/default-book-cover.jpg'; }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Borrowed: {book.borrowDate}</span>
                  <span>Due: {book.dueDate}</span>
                </div>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Currently Borrowed
                </span>
              </div>
            </div>
          ))}

          {borrowedBooks.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No books currently borrowed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooks;
