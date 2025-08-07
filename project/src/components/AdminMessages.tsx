import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';

interface BookRequest {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  borrowDays: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  returnStatus?: 'pending' | 'returned' | 'overdue';
  requestDate: string;
  returnDate?: string;
}

const AdminMessages = () => {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      console.log('Fetching requests...');
      const response = await fetch('http://localhost:5000/api/requests');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests');
      }
      
      console.log('Fetched requests:', data);
      setRequests(data);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      console.log(`Processing ${action} action for request ${requestId}`);
      
      const request = requests.find(req => req._id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          status: action,
          userId: request.userId,
          bookTitle: request.bookTitle,
          returnDate: action === 'approved' ? 
            new Date(Date.now() + (request.borrowDays * 24 * 60 * 60 * 1000)).toISOString() : 
            undefined
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} request`);
      }

      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: action } : req
        )
      );

      await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: request.userId,
          message: action === 'approved'
            ? `Your request to borrow "${request.bookTitle}" has been approved! You can collect the book from the library. Please return it within ${request.borrowDays} days.`
            : `Your request to borrow "${request.bookTitle}" has been rejected. Please contact the librarian for more information.`,
          type: action === 'approved' ? 'success' : 'error'
        })
      });

      const updateEvent = new CustomEvent('borrowRequestUpdate', {
        detail: {
          requestId,
          userId: request.userId,
          status: action,
          bookTitle: request.bookTitle,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(updateEvent);

      alert(`Request ${action} successfully`);

    } catch (err: any) {
      console.error(`Error ${action} request:`, err);
      alert(err.message || `Failed to ${action} request. Please try again.`);
    } finally {
      setLoading(false);
      fetchRequests();
    }
  };

  const handleReturnAction = async (requestId: string, returnStatus: 'returned' | 'overdue') => {
    try {
      setLoading(true);
      
      const request = requests.find(req => req._id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }
  
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          returnStatus,
          userId: request.userId,
          bookTitle: request.bookTitle
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to process return`);
      }
  
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, returnStatus } : req
        )
      );
  
      await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: request.userId,
          message: returnStatus === 'returned'
            ? `Thank you for returning "${request.bookTitle}". Your return has been processed successfully.`
            : `The book "${request.bookTitle}" is overdue. Please return it as soon as possible to avoid penalties.`,
          type: returnStatus === 'returned' ? 'success' : 'warning'
        })
      });
  
      if (returnStatus === 'returned') {
        const bookUpdateEvent = new CustomEvent('bookUpdated', {
          detail: {
            bookId: request.bookId,
            status: 'available',
            action: 'return'
          }
        });
        window.dispatchEvent(bookUpdateEvent);
        
        const borrowedUpdateEvent = new CustomEvent('borrowedBooksUpdate', {
          detail: {
            requestId: request._id,
            userId: request.userId,
            returnStatus
          }
        });
        window.dispatchEvent(borrowedUpdateEvent);
      }
  
      alert(`Return status updated to ${returnStatus}`);
  
    } catch (err: any) {
      console.error(`Error processing return:`, err);
      alert(err.message || `Failed to process return. Please try again.`);
    } finally {
      setLoading(false);
      fetchRequests();
    }
  };
  

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Book Requests</h1>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">{request.bookTitle}</h2>
                    <p className="text-gray-600">Requested by: {request.userName}</p>
                    <p className="text-gray-600">Email: {request.userEmail}</p>
                    {request.purpose != "reserve" && <p className="text-gray-600">Borrow Days: {request.borrowDays}</p>}
                    <p className="text-gray-600">Purpose: {request.purpose}</p>
                    <p className="text-gray-600">
                      Request Date: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    {request.returnDate && (
                      <p className="text-gray-600">
                        Return Due: {new Date(request.returnDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.returnStatus && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${request.returnStatus === 'returned' ? 'bg-blue-100 text-blue-800' :
                            request.returnStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {request.returnStatus.charAt(0).toUpperCase() + request.returnStatus.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRequestAction(request._id, 'approved')}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Approve {request.purpose == "reserve" && <span>reserve</span>}
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 'rejected')}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Reject {request.purpose == "reserve" && <span>reserve</span>}
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && !request.returnStatus && (
                      <>
                        <button
                          onClick={() => handleReturnAction(request._id, 'returned')}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Mark as returned
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 bg-white rounded-lg shadow-md p-8">
              No book requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
