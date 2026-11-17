require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Hosts like Render sit behind a proxy. This lets the rate limiter see the real visitor address.
app.set('trust proxy', 1);

app.use(helmet());
// Local: falls back to localhost. Live: set FRONTEND_URL to the Vercel address (no trailing slash).
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.get('/', (req, res) => res.send('AgriTransport API'));
app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log('API on port ' + PORT));
}).catch((e) => console.error('DB error', e));