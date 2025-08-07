import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'error';
  createdAt: string;
  read: boolean;
}

const UserMessages = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId') || 'default-user';

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('Fetching notifications for user:', userId);
      const response = await fetch(`http://localhost:5000/api/notifications/user/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications');
      }
      
      console.log('Fetched notifications:', data);
      // Sort notifications by date, newest first
      const sortedNotifications = data.sort((a: Notification, b: Notification) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    
    const pollingInterval = setInterval(fetchNotifications, 5000); 

    const handleBorrowRequestUpdate = (event: any) => {
      const { userId: eventUserId } = event.detail;
      console.log('Received update event for user:', eventUserId, 'current user:', userId);
      if (eventUserId === userId) {
        console.log('Refreshing messages for user:', userId);
        fetchNotifications();
      }
    };

    window.addEventListener('borrowRequestUpdate', handleBorrowRequestUpdate);

    return () => {
      clearInterval(pollingInterval);
      window.removeEventListener('borrowRequestUpdate', handleBorrowRequestUpdate);
    };
  }, [userId, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      setNotifications(notifications.map(notif =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading messages...
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Messages</h1>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  notification.type === 'success' ? 'border-green-500' :
                  notification.type === 'error' ? 'border-red-500' :
                  'border-blue-500'
                } ${!notification.read ? 'bg-blue-50' : ''} cursor-pointer transition-colors duration-200 hover:bg-gray-50`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-800 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any messages yet. They will appear here when you receive them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMessages; 