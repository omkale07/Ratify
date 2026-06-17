import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLogOut, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function UserStores() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [ratingInput, setRatingInput] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: ''
  });

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, order };
      const res = await API.get('/user/stores', { params });
      setStores(res.data);
    } catch (err) {
      toast.error('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, [sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (storeId, value) => {
    setRatingInput({ ...ratingInput, [storeId]: value });
  };

  const handleSubmitRating = async (storeId) => {
    const rating = parseInt(ratingInput[storeId]);
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5.'); return;
    }
    try {
      await API.post('/user/ratings', { store_id: storeId, rating });
      toast.success('Rating submitted!');
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  const handleUpdateRating = async (storeId) => {
    const rating = parseInt(ratingInput[storeId]);
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5.'); return;
    }
    try {
      await API.put('/user/ratings', { store_id: storeId, rating });
      toast.success('Rating updated!');
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update rating.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passRegex.test(passwordData.newPassword)) {
      toast.error('Password: 8-16 chars, uppercase + special character.'); return;
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

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'ASC'
      ? <FiArrowUp className="inline ml-1" />
      : <FiArrowDown className="inline ml-1" />;
  };

  const StarRating = ({ storeId, currentRating }) => {
    const selected = ratingInput[storeId] || currentRating || 0;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(storeId, star)}
            className={`text-2xl transition ${
              star <= selected ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

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

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Stores</h2>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name" placeholder="Search by Name"
              value={filters.name} onChange={handleFilterChange}
              className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              name="address" placeholder="Search by Address"
              value={filters.address} onChange={handleFilterChange}
              className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={fetchStores}
            className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Search
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          <span>Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center gap-1 hover:text-indigo-600 ${sortBy === 'name' ? 'text-indigo-600 font-semibold' : ''}`}
          >
            Name <SortIcon field="name" />
          </button>
          <button
            onClick={() => handleSort('address')}
            className={`flex items-center gap-1 hover:text-indigo-600 ${sortBy === 'address' ? 'text-indigo-600 font-semibold' : ''}`}
          >
            Address <SortIcon field="address" />
          </button>
        </div>

        {/* Store Cards */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading stores...</div>
        ) : stores.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No stores found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{store.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{store.address}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Overall Rating</p>
                    <p className="text-yellow-500 font-bold text-lg">
                      {store.avgRating ? `⭐ ${store.avgRating}` : 'No ratings yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Your Rating</p>
                    <p className="text-indigo-600 font-bold text-lg">
                      {store.userRating ? `⭐ ${store.userRating}` : 'Not rated'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">
                    {store.userRating ? 'Update your rating:' : 'Rate this store:'}
                  </p>
                  <StarRating storeId={store.id} currentRating={store.userRating} />
                </div>

                <button
                  onClick={() =>
                    store.userRating
                      ? handleUpdateRating(store.id)
                      : handleSubmitRating(store.id)
                  }
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                >
                  {store.userRating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            ))}
          </div>
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
