import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

interface BorrowRequest {
  _id: string;
  bookTitle: string;
  borrowDays: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

const UserAccount = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('Please log in to view your account');
      return;
    }

    fetchRequests();
    // Refresh requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;

    try {
      console.log('Fetching user requests...');
      const response = await fetch(`http://localhost:5000/api/requests/user/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests');
      }

      console.log('Fetched requests:', data);
      setRequests(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError('Failed to load your requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-500';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-500';
      default:
        return 'text-yellow-600 bg-yellow-100 border-yellow-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading your requests...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Please log in to view your account
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Account</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">My Borrow Requests</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{request.bookTitle}</h3>
                      <p className="text-gray-600">Borrow Days: {request.borrowDays}</p>
                      <p className="text-gray-600">Purpose: {request.purpose}</p>
                      <p className="text-gray-600">
                        Requested on: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>You haven't made any borrow requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount; 