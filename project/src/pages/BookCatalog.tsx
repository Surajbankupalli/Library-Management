import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, BookOpen, Clock, Filter, X, ExternalLink } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface BorrowDialogProps {
  book: Book;
  onClose: () => void;
}

interface Book {
  _id: string;
  id?: number;
  title: string;
  author: string;
  cover: string;
  status: 'available' | 'not available';
  category: string;
  popularity: number;
  dateAdded: string;
  readLink: string;
  count: number;
}

const BorrowDialog: React.FC<BorrowDialogProps> = ({ book, onClose }) => {
  const navigate = useNavigate();
  const [borrowDays, setBorrowDays] = useState('1');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentDate = new Date();
  const dueDate = addDays(currentDate, parseInt(borrowDays));

  const handleSendRequest = async () => {
    try {
      setIsSubmitting(true);
      console.log(localStorage.getItem('studentId'))
      const requestData = {
        bookId: book._id,
        userId: localStorage.getItem('studentId'),
        userName: localStorage.getItem('studentFirstName'),
        userEmail: localStorage.getItem('studentEmail'),
        bookTitle: book.title,
        borrowDays: parseInt(borrowDays),
        purpose: purpose.trim() || 'No purpose specified'
      };

      console.log('Sending request data:', requestData);

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.message || 'Failed to send request');
      }

      if (data.success) {
        onClose();
        alert('Request sent successfully!');
        
      } else {
        throw new Error(data.message || 'Failed to send request');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Borrow Book</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
            <p className="text-gray-600">by {book.author}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-600 mb-2">
              Current Date: {format(currentDate, 'MMMM d, yyyy')}
            </p>
            <p className="text-green-700">
              Due Date: {format(dueDate, 'MMMM d, yyyy')}
            </p>
            <p className="text-red-600 font-medium mt-2">
              Fine per day in case of late submission: 30/-
            </p>
          </div>

          <div>
            <label htmlFor="borrowDays" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Days to Borrow
            </label>
            <select
              id="borrowDays"
              value={borrowDays}
              onChange={(e) => setBorrowDays(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'day' : 'days'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Borrowing
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your purpose for borrowing this book..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSendRequest}
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReserveDialog: React.FC = ({ book, onClose } :any) => {
  const navigate = useNavigate();
  const [borrowDays, setBorrowDays] = useState('1');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentDate = new Date();
  const dueDate = addDays(currentDate, parseInt(borrowDays));

  const handleSendRequest = async () => {
    try {
      setIsSubmitting(true);
      console.log(localStorage.getItem('studentId'))
      const requestData = {
        bookId: book._id,
        userId: localStorage.getItem('studentId'),
        userName: localStorage.getItem('studentFirstName'),
        userEmail: localStorage.getItem('studentEmail'),
        bookTitle: book.title,
        borrowDays: parseInt(borrowDays),
        purpose: 'reserve'
      };

      console.log('Sending request data:', requestData);

      const response = await fetch('http://localhost:5000/api/requests/res', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.message || 'Failed to send request');
      }

      if (data.success) {
        onClose();
        alert('Request sent successfully!');
       
      } else {
        throw new Error(data.message || 'Failed to send request');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800">Confirm Action</h2>
        <p className="mt-2 text-gray-600">Are you sure you want to send this request?</p>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendRequest}
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed min-w-[120px] transition"
          >
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BookCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrow, isborrows] = useState<"b" | "r" | "n">("n");
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Finance',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500',
      description: 'Books about personal finance, investing, and economics'
    },
    {
      name: 'Self Development',
      image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=500',
      description: 'Personal growth and self-improvement books'
    },
    {
      name: 'Productivity',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500',
      description: 'Time management and efficiency optimization'
    },
    {
      name: 'Technology',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
      description: 'Programming, AI, and digital transformation'
    },
    {
      name: 'Business',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500',
      description: 'Entrepreneurship and business strategy'
    },
    {
      name: 'Science',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500',
      description: 'Scientific discoveries and research'
    }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        console.log('Fetched books:', data);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
  
    fetchBooks();
    // Refresh books every 30 seconds to get latest updates
    const interval = setInterval(fetchBooks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add a listener to update book status when a book is borrowed or returned
  // Add a listener to update book status when a book is borrowed or returned
useEffect(() => {
  const handleBookUpdate = (event: any) => {
    if (event.detail && event.detail.book) {
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === event.detail.book._id ? event.detail.book : book
        )
      );
    } else if (event.detail && event.detail.bookId && event.detail.action === 'return') {
      // Update book status when it's marked as returned
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === event.detail.bookId 
            ? { ...book, status: 'available', count: book.count + 1 } 
            : book
        )
      );
    }
  };

  window.addEventListener('bookUpdated', handleBookUpdate);
  return () => {
    window.removeEventListener('bookUpdated', handleBookUpdate);
  };
}, []);

  const filterBooks = () => {
    let filteredBooks = [...books];

    // Apply search filter
    if (searchQuery) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
    }

    // Apply status and sorting filters
    switch (selectedFilter) {
      case 'available':
        return filteredBooks.filter(book => book.status === 'available');
      case 'unavailable':
        return filteredBooks.filter(book => book.status === 'not available');
      default:
        return filteredBooks;
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleBorrow = (book: Book) => {
    console.log('Borrowing book:', book);
    if (book.status === 'available' && book.count > 0) {
      setSelectedBook(book);
      isborrows("b");
    } else {
      alert('This book is not available for borrowing.');
    }
  };
  
  const handleReserve = (book: Book) => {
    console.log('Reserving book:', book);
    if (book.count == 0) {
      setSelectedBook(book);
      isborrows("r");
    } else {
      alert('This book is not available for reserving.');
    }
  };

  const handleBookBorrowed = (bookId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book._id === bookId ? { ...book, status: 'not available' } : book
      )
    );

  
    
    const borrowEvent = new CustomEvent('bookBorrowed', {
      detail: { bookId }
    });
    window.dispatchEvent(borrowEvent);
  };

  const onDialogClosed = (bookId?: string) => {
    if (bookId) {
      handleBookBorrowed(bookId);
    }
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Book Catalog</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowCategoryModal(true)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            } border border-gray-300 hover:bg-indigo-50 transition-colors`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {selectedCategory || 'Select Category'}
          </button>

          <button
            onClick={() => setSelectedFilter('available')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              selectedFilter === 'available' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            } border border-gray-300 hover:bg-indigo-50 transition-colors`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Available
          </button>

          <button
            onClick={() => setSelectedFilter('unavailable')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              selectedFilter === 'unavailable' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            } border border-gray-300 hover:bg-indigo-50 transition-colors`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Unavailable
          </button>

          

          {(selectedFilter !== 'all' || selectedCategory) && (
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedCategory('');
              }}
              className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterBooks().map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <p className="text-gray-600 mb-2">Category: {book.category}</p>
                <p className="text-gray-600 mb-2">Count: {book.count}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    book.status === 'available' 
                      ? 'bg-green-100 text-green-800 border border-green-500' 
                      : 'bg-red-100 text-red-800 border border-red-500'
                  }`}>
                    {book.status}
                  </span>
                  
                  
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (book.status !== 'available' || book.count <= 0) {
                        alert('This book is not available for borrowing. Please check back later.');
                        return;
                      }
                      handleBorrow(book);
                    }}
                    className={`px-4 py-2 rounded transition-colors ${
                      book.status === 'available' && book.count > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => {
                      handleReserve(book);
                    }}
                    className={`px-4 py-2 border rounded transition-colors ${
                      book.status === 'not available' && book.count == 0
                        ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                        : 'border-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Selection Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Select Category</h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-indigo-50 border-2 border-indigo-600'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

       {/* Borrow/Reserve Dialog */}
{selectedBook && borrow !== 'n' && (
  borrow === 'b' ? (
    <BorrowDialog
      book={selectedBook}
      onClose={() => onDialogClosed()}
    />
  ) : borrow === 'r' ? (
    <ReserveDialog
      book={selectedBook}
      onClose={() => onDialogClosed()}
    />
  ) : null
)}

      </div>
    </div>
  );
};

export default BookCatalog;
