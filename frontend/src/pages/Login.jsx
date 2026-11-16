import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function EyeIcon({ hide }) {
  if (hide) {
    return (
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
        <line x1='1' y1='1' x2='23' y2='23' />
      </svg>
    );
  }
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );
}

const DEMO_ACCOUNTS = [
  { label: 'Demo Farmer', email: 'farmer@agri.com', pass: 'Farmer@123' },
  { label: 'Demo Transporter', email: 'transporter@agri.com', pass: 'Transporter@123' },
  { label: 'Demo Admin', email: 'admin@agri.com', pass: 'Admin@123' }
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await login(form.email, form.password);
      nav('/' + u.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const demoLogin = async (email, password) => {
    setError('');
    setForm({ email, password });
    try {
      const u = await login(email, password);
      nav('/' + u.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    }
  };

  return (
    <div className='card' style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ paddingRight: 42, marginBottom: 0, width: '100%', boxSizing: 'border-box' }}
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#555',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <EyeIcon hide={showPassword} />
          </button>
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit'>Login</button>
      </form>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Quick Demo Login:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type='button'
              onClick={() => demoLogin(acc.email, acc.pass)}
              style={{ flex: 1, fontSize: 13, padding: '8px 10px' }}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 14 }}>No account? <Link to='/register'>Register</Link></p>
    </div>
  );
}