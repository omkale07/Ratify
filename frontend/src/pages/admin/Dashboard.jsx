import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUsers, FiShoppingBag, FiStar, FiLogOut } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Ratify</h1>
        <div className="flex items-center gap-6">
          <span className="text-indigo-200">Welcome, {user?.name}</span>
          <button
            onClick={() => navigate('/admin/users')}
            className="hover:text-indigo-200 transition"
          >
            Users
          </button>
          <button
            onClick={() => navigate('/admin/stores')}
            className="hover:text-indigo-200 transition"
          >
            Stores
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-lg transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
              <div className="bg-indigo-100 p-4 rounded-full">
                <FiUsers className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>

            {/* Total Stores */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <FiShoppingBag className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Stores</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalStores}</p>
              </div>
            </div>

            {/* Total Ratings */}
            <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
              <div className="bg-yellow-100 p-4 rounded-full">
                <FiStar className="text-yellow-500 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Ratings</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalRatings}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}