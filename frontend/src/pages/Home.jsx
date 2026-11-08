import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { STORES } from '../data/stores';

const MODES = [
  { icon: '🛻', name: 'Mini Truck', capacity: 'Up to ~750 kg', best: 'Small loads, short local trips' },
  { icon: '🚚', name: 'Pickup Truck', capacity: 'Up to ~1.5 tonnes', best: 'Vegetables and fruits to nearby markets' },
  { icon: '❄️', name: 'Refrigerated Truck', capacity: 'Up to 3 tonnes', best: 'Perishables: milk, flowers, fresh produce' },
  { icon: '🚜', name: 'Tractor Trailer', capacity: '3 tonnes and above', best: 'Bulk grain and farm-to-mandi transport' }
];

const STEPS = [
  { n: 1, title: 'Farmer creates a request', text: 'Enter pickup, drop (or a nearby store), produce and quantity.' },
  { n: 2, title: 'Transporter accepts', text: 'A transporter accepts the job and picks up the produce.' },
  { n: 3, title: 'Delivery', text: 'The transporter marks the shipment as delivered.' },
  { n: 4, title: 'Blockchain proof', text: 'Every step is recorded on the blockchain and cannot be edited.' }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>AgriTransport</h1>
        <p>
          A blockchain-based smart transportation system that connects farmers and transporters,
          and keeps a tamper-proof record of every shipment.
        </p>
        {user ? (
          <Link className="btn" to={'/' + user.role}>Go to my dashboard</Link>
        ) : (
          <>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn outline" to="/register">Register</Link>
          </>
        )}
      </div>

      <div className="card home-section">
        <h2>About</h2>
        <p>
          Farmers often depend on middlemen to move their produce, and shipment records kept in
          ordinary databases can be edited or lost. AgriTransport lets farmers book transport
          directly, lets transporters accept and deliver jobs, and gives admins a view of the whole
          system.
        </p>
        <p>
          Normal data is stored in MongoDB for speed. Every shipment event (Created, Accepted,
          PickedUp, Delivered) is also written to an Ethereum smart contract, so the history is
          append-only and can be verified.
        </p>
        <div className="cards">
          <div className="mini-card"><div className="icon">🌾</div><h4>Farmer</h4><p>Creates shipment requests and tracks them.</p></div>
          <div className="mini-card"><div className="icon">🚛</div><h4>Transporter</h4><p>Accepts jobs, picks up and delivers.</p></div>
          <div className="mini-card"><div className="icon">🛡️</div><h4>Admin</h4><p>Monitors users, shipments and statistics.</p></div>
        </div>
      </div>

      <div className="card home-section">
        <h2>How it works</h2>
        <div className="cards">
          {STEPS.map((s) => (
            <div className="mini-card" key={s.n}>
              <span className="tag">Step {s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card home-section">
        <h2>Modes of transport</h2>
        <div className="cards">
          {MODES.map((m) => (
            <div className="mini-card" key={m.name}>
              <div className="icon">{m.icon}</div>
              <h4>{m.name}</h4>
              <span className="tag">{m.capacity}</span>
              <p>{m.best}</p>
            </div>
          ))}
        </div>
       
      </div>

      <div className="card home-section">
        <h2>Nearby stores in Hyderabad</h2>
        <p>Farmers can choose any of these stores as the drop location when creating a shipment.</p>
        <div className="cards">
          {STORES.map((s) => (
            <div className="mini-card" key={s.id}>
              <div className="icon">🏬</div>
              <h4>{s.name}</h4>
              <span className="tag">{s.type}</span>
              <p>{s.area}, {s.city}</p>
              <p>{s.distanceKm} km away</p>
            </div>
          ))}
        </div>
      
      </div>
    </div>
  );
}