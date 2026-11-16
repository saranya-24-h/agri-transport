import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import StatusBadge from '../StatusBadge';
import { ROADS, STORES, storeLabel } from '../data/stores';
import { formatPrice } from '../data/pricing';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dropType, setDropType] = useState('road');

  const [form, setForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    produce: '',
    quantityKg: '',
  });

  const loadShipments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipments');
      setShipments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchDropType = (type) => {
    setDropType(type);
    setForm((prev) => ({ ...prev, dropLocation: '' }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/shipments', {
        pickupLocation: form.pickupLocation,
        dropLocation: form.dropLocation,
        produce: form.produce,
        quantityKg: Number(form.quantityKg),
      });
      setSuccess('Shipment request created successfully.');
      setForm({ pickupLocation: '', dropLocation: '', produce: '', quantityKg: '' });
      loadShipments();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to create shipment');
    }
  };

  const dropOptions = dropType === 'road' ? ROADS : STORES;

  return (
    <div className="container">
      <h2>Farmer Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      <div className="card">
        <h3>Create New Shipment Request</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="ok">{success}</p>}
        <form onSubmit={handleCreate}>
          <input
            type="text"
            name="pickupLocation"
            placeholder="Pickup Location (Remote Farm / Village)"
            value={form.pickupLocation}
            onChange={handleChange}
            required
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#444' }}>Drop-off Type:</span>
            <button
              type="button"
              onClick={() => switchDropType('road')}
              style={{
                padding: '5px 12px',
                fontSize: 13,
                background: dropType === 'road' ? '#2e7d32' : '#e8f5e9',
                color: dropType === 'road' ? '#fff' : '#2e7d32',
                border: '1px solid #2e7d32'
              }}
            >
              🛣️ Motorable Road
            </button>
            <button
              type="button"
              onClick={() => switchDropType('store')}
              style={{
                padding: '5px 12px',
                fontSize: 13,
                background: dropType === 'store' ? '#2e7d32' : '#e8f5e9',
                color: dropType === 'store' ? '#fff' : '#2e7d32',
                border: '1px solid #2e7d32'
              }}
            >
              🏬 Store
            </button>
          </div>

          <input
            type="text"
            name="dropLocation"
            list="drop-options"
            placeholder={
              dropType === 'road'
                ? 'Nearest Motorable Road (type or pick junction)'
                : 'Drop Location (type or pick a Hyderabad store)'
            }
            value={form.dropLocation}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <datalist id="drop-options">
            {dropOptions.map((s) => (
              <option key={s.id} value={storeLabel(s)}>
                {s.distanceKm} km away
              </option>
            ))}
          </datalist>

          <input
            type="text"
            name="produce"
            placeholder="Produce / Crop Type"
            value={form.produce}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantityKg"
            placeholder="Quantity (Kg)"
            value={form.quantityKg}
            onChange={handleChange}
            required
          />
          <button type="submit">Create Shipment</button>
        </form>
      </div>

      <div className="card">
        <h3>My Shipments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : shipments.length === 0 ? (
          <p>No shipments yet.</p>
        ) : (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Pickup (Farm)</th>
                  <th>Drop Location</th>
                  <th>Qty (Kg)</th>
                  <th>Transporter</th>
                  <th>Vehicle</th>
                  <th>Price</th>
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
                    <td>{s.quantityKg}</td>
                    <td>{s.transporter?.name || '-'}</td>
                    <td>{s.vehicleType || '-'}</td>
                    <td>{formatPrice(s.price)}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <Link to={`/shipment/${s._id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}