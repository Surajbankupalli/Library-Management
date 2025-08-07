import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, Clock, AlertCircle } from 'lucide-react';

interface BorrowHistory {
  id: string;
  title: string;
  borrowDate: string;
  dueDate: string;
  purpose: string
  status: 'pending' | 'approved' | 'rejected';
}

const MyAccount = () => {
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const userId = localStorage.getItem('studentId');
        const response = await fetch(`http://localhost:5000/api/requests/userrequests/${userId}`);
        const data = await response.json();
        console.log("Aditya");
        console.log(data);
        if (!response.ok) throw new Error(data.error);
        
        // Sort by date, newest first and take only the 5 most recent
        const sortedData = data
          .sort((a: any, b: any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
          .slice(0, 5);
        
        setBorrowingHistory(sortedData.map((request: any) => ({
          id: request._id,
          title: request.bookTitle,
          borrowDate: new Date(request.requestDate).toISOString().split('T')[0],
          dueDate: new Date(new Date(request.requestDate).getTime() + request.borrowDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: request.status,
          purpose: request.purpose
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
    // Refresh history every 30 seconds
    const interval = setInterval(fetchBorrowHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">My Account</h1>

        <div className="grid gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Recent Borrowing History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowingHistory.map((item) => (
                    <tr key={item.id}>
                
                      <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.borrowDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {borrowingHistory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No borrowing history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        
        </div>
        <div className="grid gap-8 mt-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Recent Reserve History</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserve Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowingHistory.filter(item => item.purpose === "reserve").map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {borrowingHistory.filter(item => item.purpose === "reserve").length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No borrowing history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
