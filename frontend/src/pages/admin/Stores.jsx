import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLogOut, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function AdminStores() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', owner_id: ''
  });

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, order };
      const res = await API.get('/admin/stores', { params });
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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (formData.name.length < 20 || formData.name.length > 60) {
      toast.error('Store name must be 20-60 characters.'); return;
    }
    if (formData.address.length > 400) {
      toast.error('Address max 400 characters.'); return;
    }
    try {
      await API.post('/admin/stores', formData);
      toast.success('Store created!');
      setShowModal(false);
      setFormData({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store.');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'ASC' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />;
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-xs">No ratings</span>;
    return (
      <span className="text-yellow-500 font-semibold">
        ⭐ {rating}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Ratify</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/dashboard')} className="hover:text-indigo-200 transition">Dashboard</button>
          <button onClick={() => navigate('/admin/users')} className="hover:text-indigo-200 transition">Users</button>
          <button onClick={handleLogout} className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Stores</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus /> Add Store
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name" placeholder="Filter by Name"
            value={filters.name} onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="email" placeholder="Filter by Email"
            value={filters.email} onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="address" placeholder="Filter by Address"
            value={filters.address} onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={fetchStores}
            className="md:col-span-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Apply Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                  Name <SortIcon field="name" />
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('email')}>
                  Email <SortIcon field="email" />
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('address')}>
                  Address <SortIcon field="address" />
                </th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No stores found.</td></tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{store.name}</td>
                    <td className="px-4 py-3">{store.email}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{store.address}</td>
                    <td className="px-4 py-3">{renderStars(store.avgRating)}</td>
                    <td className="px-4 py-3">{store.totalRatings}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Store</h3>
            <form onSubmit={handleAddStore} className="space-y-4">
              <input
                name="name" placeholder="Store Name (20-60 chars)"
                value={formData.name} onChange={handleFormChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                name="email" type="email" placeholder="Store Email"
                value={formData.email} onChange={handleFormChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="address" placeholder="Store Address (max 400 chars)"
                value={formData.address} onChange={handleFormChange} required rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <input
                name="owner_id" type="number" placeholder="Owner ID (optional)"
                value={formData.owner_id} onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Create Store
                </button>
                <button type="button" onClick={() => setShowModal(false)}
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