import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className='nav'>
      <Link
        to='/'
        style={{ marginLeft: 0, fontWeight: 'bold', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <img src='/logo.svg' alt='AgriTransport logo' height='52' width='52' />
        AgriTransport
      </Link>
      <div>
        <Link to='/'>Home</Link>
        {user ? (
          <>
            <Link to={'/' + user.role}>Dashboard</Link>
            <span style={{ marginLeft: 14 }}>{user.name} ({user.role})</span>
            <Link to='/login' onClick={logout}>Logout</Link>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}