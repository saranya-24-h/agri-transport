import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const onHome = pathname === '/';
  const onDashboard = user && pathname === '/' + user.role;
  const onLogin = pathname === '/login';
  const onRegister = pathname === '/register';

  return (
    <div className='nav'>
      <Link
        to='/'
        style={{ marginLeft: 0, fontWeight: 'bold', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <img src='/logo.svg' alt='AgriTransport logo' height='52' width='52' />
        AgriTransport
      </Link>
      <div className='nav-links'>
        <Link className={onHome ? 'nav-btn current' : 'nav-btn'} to='/'>Home</Link>
        {user ? (
          <>
            <Link className={onDashboard ? 'nav-btn current' : 'nav-btn'} to={'/' + user.role}>Dashboard</Link>
            <span className='nav-user'>{user.name} ({user.role})</span>
            <Link className='nav-btn logout' to='/login' onClick={logout}>Logout</Link>
          </>
        ) : (
          <>
            <Link className={onLogin ? 'nav-btn current' : 'nav-btn'} to='/login'>Login</Link>
            <Link className={onRegister ? 'nav-btn primary current' : 'nav-btn primary'} to='/register'>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}