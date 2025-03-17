// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { getBrts, addBrt } from '../features/brtSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { brts, loading, error } = useSelector((state) => state.brts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    reserved_amount: '',
    status: 'active',
  });

  // Fetch BRTs on component mount
  useEffect(() => {
    dispatch(getBrts());
  }, [dispatch]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleCreateBrt = async (e) => {
    e.preventDefault();
    dispatch(addBrt(formData))
      .unwrap()
      .then(() => {
        setShowCreateForm(false);
        setFormData({ reserved_amount: '', status: 'active' });
      })
      .catch((error) => {
        console.error('Failed to create BRT:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            className="h-10"
          />
          <h1 className="text-xl font-bold ml-2">Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </header>

      {/* Body */}
      <div className="container mx-auto p-4">
        {/* Create BRT Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">BRT List</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {showCreateForm ? 'Cancel' : 'Create BRT'}
          </button>
        </div>

        {/* Create BRT Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">Create New BRT</h3>
            <form onSubmit={handleCreateBrt}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Reserved Amount
                </label>
                <input
                  type="number"
                  name="reserved_amount"
                  value={formData.reserved_amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? 'Creating...' : 'Create BRT'}
              </button>
            </form>
          </div>
        )}

        {/* BRT List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BRT Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reserved Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {brts.map((brt) => (
                <tr key={brt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brt.brt_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brt.reserved_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        brt.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {brt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(brt.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;