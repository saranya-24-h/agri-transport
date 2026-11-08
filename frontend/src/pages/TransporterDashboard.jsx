import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from '../StatusBadge';
import { suitableVehicles } from '../data/vehicles';

export default function TransporterDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [choice, setChoice] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipments');
      const all = res.data;
      setAvailable(all.filter((s) => s.status === 'Created' && !s.transporter));
      setMyShipments(all.filter((s) => s.transporter && s.transporter._id === user.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id, action, body) => {
    setError('');
    setSuccess('');
    try {
      await api.patch(`/shipments/${id}/${action}`, body);
      setSuccess(`Shipment ${action} successful.`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} shipment`);
    }
  };

  return (
    <div className="container">
      <h2>Transporter Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      {error && <p className="error">{error}</p>}
      {success && <p className="ok">{success}</p>}

      <div className="card">
        <h3>Available Shipment Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : available.length === 0 ? (
          <p>No available shipments right now.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produce</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Qty (Kg)</th>
                <th>Vehicle</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {available.map((s) => {
                const options = suitableVehicles(s.quantityKg);
                const selected = choice[s._id] || options[0].name;
                return (
                  <tr key={s._id}>
                    <td>{s.produce}</td>
                    <td>{s.pickupLocation}</td>
                    <td>{s.dropLocation}</td>
                    <td>{s.quantityKg}</td>
                    <td>
                      <select
                        value={selected}
                        onChange={(e) => setChoice({ ...choice, [s._id]: e.target.value })}
                        style={{ margin: 0 }}
                      >
                        {options.map((v) => (
                          <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleAction(s._id, 'accept', { vehicleType: selected })}>
                        Accept
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3>My Assigned Shipments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : myShipments.length === 0 ? (
          <p>No assigned shipments yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produce</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Qty (Kg)</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Action</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {myShipments.map((s) => (
                <tr key={s._id}>
                  <td>{s.produce}</td>
                  <td>{s.pickupLocation}</td>
                  <td>{s.dropLocation}</td>
                  <td>{s.quantityKg}</td>
                  <td>{s.vehicleType || '-'}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {s.status === 'Accepted' && (
                      <button onClick={() => handleAction(s._id, 'pickup')}>Mark Picked Up</button>
                    )}
                    {s.status === 'PickedUp' && (
                      <button onClick={() => handleAction(s._id, 'deliver')}>Mark Delivered</button>
                    )}
                    {s.status === 'Delivered' && <span>Completed</span>}
                  </td>
                  <td>
                    <Link to={`/shipment/${s._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}