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

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', phone: '', village: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await register(form);
      nav('/' + u.role);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    }
  };

  return (
    <div className='card' style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder='Full name' value={form.name} onChange={set('name')} required />
        <input type='email' placeholder='Email' value={form.email} onChange={set('email')} required />
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password (min 8 characters)'
            value={form.password}
            onChange={set('password')}
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
        <input placeholder='Phone' value={form.phone} onChange={set('phone')} />
        <input placeholder='Village' value={form.village} onChange={set('village')} />
        <select value={form.role} onChange={set('role')}>
          <option value='farmer'>Farmer</option>
          <option value='transporter'>Transporter</option>
        </select>
        {error && <p className='error'>{error}</p>}
        <button type='submit'>Create account</button>
      </form>
      <p>Already registered? <Link to='/login'>Login</Link></p>
    </div>
  );
}