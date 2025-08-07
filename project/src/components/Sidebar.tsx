import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, HelpCircle, MessageSquare, BookCheck, Bell, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/user/${userId}/unread/count`);
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/book-catalog', icon: BookOpen, label: 'Book Catalog' },
    { path: '/borrowed-books', icon: BookCheck, label: 'Borrowed Books' },
  
    { path: '/my-account', icon: User, label: 'My Account' },
    { path: '/help-support', icon: HelpCircle, label: 'Help & Support' }
  ];

  return (
    <div className="h-screen w-64 bg-indigo-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">Library System</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;