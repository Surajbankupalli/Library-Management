import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, MessageSquare } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests/pending/count');
        const data = await response.json();
        setPendingRequests(data.count);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/book-catalog', icon: BookOpen, label: 'Book Catalog' },
    { path: '/admin/book-management', icon: Settings, label: 'Book Management' },
    { 
      path: '/admin/messages', 
      icon: MessageSquare, 
      label: 'Notifications',
      badge: pendingRequests > 0 ? pendingRequests : undefined
    },
  ];

  return (
    <div className="h-screen w-64 bg-indigo-800 text-white fixed left-0 top-0">
  <div className="p-4">
    <div className="flex items-center space-x-2 mb-6">
      <BookOpen className="h-8 w-8 text-white" />
      <span className="text-xl font-bold text-white">UniLibrary</span>
    </div>
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
              {item.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</div>

  );
};

export default AdminSidebar;