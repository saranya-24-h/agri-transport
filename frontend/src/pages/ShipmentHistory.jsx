import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../StatusBadge';

export default function ShipmentHistory() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // The backend returns both shipment and history in one response
        const res = await api.get(`/shipments/${id}/history`);
        setShipment(res.data.shipment);
        setHistory(res.data.history);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shipment history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <Link to="/">← Back</Link>
      <h2>Shipment Details</h2>

      {shipment && (
        <div className="card">
          <p><strong>Produce:</strong> {shipment.produce}</p>
          <p><strong>Pickup:</strong> {shipment.pickupLocation}</p>
          <p><strong>Drop:</strong> {shipment.dropLocation}</p>
          <p><strong>Quantity:</strong> {shipment.quantityKg} Kg</p>
          <p><strong>Status:</strong> <StatusBadge status={shipment.status} /></p>
        </div>
      )}

      <div className="card">
        <h3>Blockchain Event History</h3>
        {history.length === 0 ? (
          <p>No events recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Actor</th>
                <th>Note</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td><StatusBadge status={h.status} /></td>
                  <td>{h.actorId}</td>
                  <td>{h.note}</td>
                  <td>{new Date(h.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}