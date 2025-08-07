import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, User, Mail, Lock, Hash } from 'lucide-react';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    adminId: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/signup', formData);
      alert('Admin registered successfully!');
      navigate('/admin/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-b from-indigo-50">
            <div className="inline-flex p-3 rounded-full bg-indigo-100">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create Admin Account</h2>
            <p className="mt-2 text-sm text-gray-600">Sign up to manage the platform</p>
          </div>

          <div className="px-8 py-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="adminId"
                  placeholder="Admin ID"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;

