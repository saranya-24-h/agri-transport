import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, shipmentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/shipments'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setShipments(shipmentsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (id) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/users/${id}`);
      setSuccess('User deleted.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card">
            <h3>Statistics</h3>
            {stats && (
              <ul>
                <li>Total Users: {stats.totalUsers}</li>
                <li>Total Farmers: {stats.totalFarmers}</li>
                <li>Total Transporters: {stats.totalTransporters}</li>
                <li>Total Shipments: {stats.totalShipments}</li>
                <li>Delivered Shipments: {stats.deliveredShipments}</li>
              </ul>
            )}
          </div>

          <div className="card">
            <h3>Users</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>All Shipments</h3>
            <table>
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Status</th>
                  <th>History</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s._id}>
                    <td>{s.produce}</td>
                    <td>{s.pickupLocation}</td>
                    <td>{s.dropLocation}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <Link to={`/shipment/${s._id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}