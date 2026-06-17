import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiLogOut, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function AdminUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', role: 'user'
  });

  const fetchUsers = async () => {
    try {
      const params = { ...filters, sortBy, order };
      const res = await API.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [sortBy, order]);

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.name.length < 20 || formData.name.length > 60) {
      toast.error('Name must be 20-60 characters.'); return;
    }
    if (formData.address.length > 400) {
      toast.error('Address max 400 characters.'); return;
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passRegex.test(formData.password)) {
      toast.error('Password: 8-16 chars, uppercase + special character.'); return;
    }
    try {
      await API.post('/admin/users', formData);
      toast.success('User created!');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await API.get(`/admin/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      toast.error('Failed to load user details.');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'ASC' ? <FiArrowUp className="inline ml-1" /> : <FiArrowDown className="inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Ratify</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/admin/dashboard')} className="hover:text-indigo-200 transition">Dashboard</button>
          <button onClick={() => navigate('/admin/stores')} className="hover:text-indigo-200 transition">Stores</button>
          <button onClick={handleLogout} className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <select
            name="role" value={filters.role} onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button
            onClick={fetchUsers}
            className="md:col-span-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
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
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('role')}>
                  Role <SortIcon field="role" />
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{u.address}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'store_owner' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewUser(u.id)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input
                name="name" placeholder="Full Name (20-60 chars)"
                value={formData.name} onChange={handleFormChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                name="email" type="email" placeholder="Email"
                value={formData.email} onChange={handleFormChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                name="password" type="password" placeholder="Password"
                value={formData.password} onChange={handleFormChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="address" placeholder="Address (max 400 chars)"
                value={formData.address} onChange={handleFormChange} required rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
              <select
                name="role" value={formData.role} onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Create User
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

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">User Details</h3>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-800">{selectedUser.name}</span></div>
              <div><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-800">{selectedUser.email}</span></div>
              <div><span className="font-medium text-gray-600">Address:</span> <span className="text-gray-800">{selectedUser.address}</span></div>
              <div><span className="font-medium text-gray-600">Role:</span> <span className="text-gray-800">{selectedUser.role}</span></div>
              {selectedUser.store && (
                <>
                  <hr />
                  <div><span className="font-medium text-gray-600">Store:</span> <span className="text-gray-800">{selectedUser.store.storeName}</span></div>
                  <div><span className="font-medium text-gray-600">Store Rating:</span> <span className="text-yellow-500 font-bold">⭐ {selectedUser.store.avgRating || 'No ratings yet'}</span></div>
                </>
              )}
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}