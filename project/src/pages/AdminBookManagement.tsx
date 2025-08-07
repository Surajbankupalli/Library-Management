import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { PlusCircle, Trash2, Edit, X } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  cover: string;
  count: number;
  status: 'available' | 'not available';
}

const AdminBookManagement = () => {
  const [activeSection, setActiveSection] = useState<'add' | 'update' | 'delete' | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [bookData, setBookData] = useState<Partial<Book>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [bookId, setBookId] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookTitleToSearch, setBookTitleToSearch] = useState('');
  const [originalTitle, setOriginalTitle] = useState<string>('');

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleDeleteBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title } = bookData;
    
    if (!title) {
      alert('Please provide the book title to delete.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/title/${encodeURIComponent(title.trim())}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Book not found');
      }

      setSelectedBook({
        id: data._id,
        title: data.title,
        author: data.author,
        category: data.category,
        description: data.description,
        cover: data.cover,
        count: data.count || 0,
        status: data.status || 'not available'
      });
      setShowConfirmDialog(true);
    } catch (error: any) {
      console.error('Error fetching book:', error);
      alert('Failed to fetch book. ' + error.message);
    }
  };

  const handleFetchBookByTitle = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!bookTitleToSearch.trim()) {
      alert('Please enter a book title to search.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/books/title/${encodeURIComponent(bookTitleToSearch.trim())}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Book not found');
      }
      
      // Set the original title when fetching for update
      setOriginalTitle(bookTitleToSearch.trim());
      
      // Populate bookData state with fetched details
      setBookData({
        title: data.title,
        author: data.author,
        category: data.category,
        description: data.description,
        cover: data.cover,
      });
    } catch (error: any) {
      console.error('Error fetching book:', error);
      alert('Failed to fetch book. ' + error.message);
      // Clear the form data if fetch fails
      setBookData({});
      setOriginalTitle('');
    }
  };
  
  
  const handleConfirm = async () => {
    switch (activeSection) {
      case 'add':
        try {
          const { title, author, category, description, cover, count } = bookData;

          if (!title || !author || !category || !description || !cover || count === undefined) {
            alert('Please fill in all fields.');
            return;
          }

          const response = await fetch('http://localhost:5000/api/books', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title.trim(),
              author: author.trim(),
              category: category.trim(),
              description: description.trim(),
              cover: cover.trim(),
              count: count
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.details || data.error || 'Failed to add book');
          }

          // Dispatch book update event
          const bookUpdateEvent = new CustomEvent('bookUpdated', {
            detail: { book: data }
          });
          window.dispatchEvent(bookUpdateEvent);

          alert('Book added successfully!');
          handleCancel();
        } catch (error: any) {
          console.error('Error adding book:', error);
          alert('Failed to add book. ' + error.message);
        }
        break;

      case 'update':
        try {
          const { title, author, category, description, cover, count } = bookData;

          if (!originalTitle || !title || !author || !category || !description || !cover || count === undefined) {
            alert('Please fill in all fields including book title.');
            return;
          }

          // Show confirmation if title is being changed
          if (title.trim() !== originalTitle.trim()) {
            if (!window.confirm(`Are you sure you want to change the book title from "${originalTitle}" to "${title}"?`)) {
              return;
            }
          }

          const updateFields = {
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            description: description.trim(),
            cover: cover.trim(),
            count: count
          };

          const response = await fetch(`http://localhost:5000/api/books/title/${encodeURIComponent(originalTitle)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateFields),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.details || data.error || 'Failed to update book');
          }

          // Dispatch book update event
          const bookUpdateEvent = new CustomEvent('bookUpdated', {
            detail: { book: data }
          });
          window.dispatchEvent(bookUpdateEvent);

          alert(title.trim() === originalTitle.trim() 
            ? 'Book updated successfully!' 
            : `Book updated successfully! Title changed from "${originalTitle}" to "${title}"`
          );
          handleCancel();
        } catch (error: any) {
          console.error('Error updating book:', error);
          alert('Failed to update book. ' + error.message);
        }
        break;

      case 'delete':
        try {
          const { title } = bookData;

          if (!title) {
            alert('Please provide the book title to delete.');
            return;
          }

          const response = await fetch(`http://localhost:5000/api/books/title/${encodeURIComponent(title.trim())}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.details || data.error || 'Failed to delete book');
          }

          alert('Book deleted successfully!');
          handleCancel(); // Clear the form after successful deletion
        } catch (error: any) {
          console.error('Error deleting book:', error);
          alert('Failed to delete book. ' + error.message);
        }
        break;

      default:
        break;
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setActiveSection(null);
    setBookData({});
    setSelectedAttributes([]);
    setBookId('');
    setSelectedBook(null);
    setBookTitleToSearch('');
    setOriginalTitle('');
  };

  const bookAttributes = [
    'title',
    'author',
    'category',
    'description',
    'cover'
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Book Management</h1>

        {!activeSection && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveSection('add')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <PlusCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-center">Add Book</h2>
            </button>
            <button
              onClick={() => setActiveSection('update')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Edit className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-center">Update Book</h2>
            </button>
            <button
              onClick={() => setActiveSection('delete')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-center">Delete Book</h2>
            </button>
          </div>
        )}

        {activeSection === 'add' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Add New Book</h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, cover: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Count
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, count: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'update' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Update Book</h2>
            {/* Step 1: Input the title to search for the book */}
            <form onSubmit={handleFetchBookByTitle} className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Book Title</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={bookTitleToSearch}
                  onChange={(e) => setBookTitleToSearch(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Fetch Book
                </button>
              </div>
            </form>

            {/* Step 2: Display book fields for editing if bookData is filled */}
            {bookData.title && (
              <form onSubmit={handleUpdateBook} className="space-y-4">
                {['title', 'author', 'category', 'description', 'cover', 'count'].map((attr) => (
                  <div key={attr}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </label>
                    {attr === 'description' ? (
                      <textarea
                        rows={4}
                        required
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={bookData[attr as keyof Book] || ''}
                        onChange={(e) => setBookData({ ...bookData, [attr]: e.target.value })}
                      />
                    ) : attr === 'count' ? (
                      <input
                        type="number"
                        required
                        min="0"
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={bookData[attr as keyof Book] || 0}
                        onChange={(e) => setBookData({ ...bookData, [attr]: parseInt(e.target.value) })}
                      />
                    ) : (
                      <input
                        type={attr === 'cover' ? 'url' : 'text'}
                        required
                        className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={bookData[attr as keyof Book] || ''}
                        onChange={(e) => setBookData({ ...bookData, [attr]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeSection === 'delete' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Delete Book</h2>
            <form onSubmit={handleDeleteBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title (to delete)
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Confirm Action</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {activeSection === 'delete' && selectedBook && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Book Details:</h3>
                  <div className="flex gap-4">
                    <img 
                      src={selectedBook.cover} 
                      alt={selectedBook.title}
                      className="w-32 h-48 object-cover rounded-md shadow-md"
                    />
                    <div>
                      <p className="mb-2"><span className="font-semibold">Title:</span> {selectedBook.title}</p>
                      <p className="mb-2"><span className="font-semibold">Author:</span> {selectedBook.author}</p>
                      <p className="mb-2"><span className="font-semibold">Category:</span> {selectedBook.category}</p>
                      <p className="mb-2"><span className="font-semibold">Description:</span> {selectedBook.description}</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-gray-700 mb-6">
                Are you sure you want to {activeSection} this book?
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  No
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookManagement;

