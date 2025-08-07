import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BookOpen, Users, Library, LogOut } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  totalBooks: number;
  recentActivities: {
    action: string;
    details: string;
    time: string;
  }[];
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBooks: 0,
    recentActivities: []
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const currentTime = format(new Date(), 'h:mm a');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.removeItem('adminToken');
    // Redirect to landing page
    navigate('https://library-management-backend-ccm4.onrender.com');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const cards = [
    { 
      title: 'Total Books', 
      count: dashboardData.totalBooks, 
      icon: BookOpen, 
      color: 'bg-blue-500' 
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">{currentDate} | {currentTime}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className={`inline-block p-3 rounded-lg ${card.color} text-white mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                <div>
                  <h3 className="font-semibold text-gray-800">{activity.action}</h3>
                  <p className="text-gray-600">{activity.details}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
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

export default AdminDashboard;
