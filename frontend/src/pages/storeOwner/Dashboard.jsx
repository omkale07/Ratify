import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLogOut, FiStar, FiUsers } from 'react-icons/fi';

export default function StoreOwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: ''
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/store-owner/dashboard');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passRegex.test(passwordData.newPassword)) {
      toast.error('Password: 8-16 chars, uppercase + special character.');
      return;
    }
    try {
      await API.put('/auth/update-password', passwordData);
      toast.success('Password updated!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Ratify</h1>
        <div className="flex items-center gap-6">
          <span className="text-indigo-200">Welcome, {user?.name?.split(' ')[0]}</span>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="hover:text-indigo-200 transition text-sm"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-lg transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-8">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : !data ? (
          <div className="text-center text-gray-400 py-12">No store found.</div>
        ) : (
          <>
            {/* Store Info Cards */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {data.store.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Average Rating */}
              <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <FiStar className="text-yellow-500 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {data.store.avgRating > 0 ? `⭐ ${data.store.avgRating}` : 'No ratings yet'}
                  </p>
                </div>
              </div>

              {/* Total Raters */}
              <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                <div className="bg-indigo-100 p-4 rounded-full">
                  <FiUsers className="text-indigo-600 text-2xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Ratings</p>
                  <p className="text-3xl font-bold text-gray-800">{data.raters.length}</p>
                </div>
              </div>
            </div>

            {/* Store Details */}
            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Store Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-gray-800 font-medium">{data.store.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Address</p>
                  <p className="text-gray-800 font-medium">{data.store.address}</p>
                </div>
              </div>
            </div>

            {/* Raters Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Users Who Rated Your Store</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-indigo-50 text-indigo-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.raters.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-400">
                        No ratings yet.
                      </td>
                    </tr>
                  ) : (
                    data.raters.map((rater, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{rater.name}</td>
                        <td className="px-4 py-3">{rater.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-yellow-500 font-bold">⭐ {rater.rating}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(rater.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input
                type="password" placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password" placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Update Password
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}