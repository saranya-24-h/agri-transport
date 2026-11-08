require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/admin', require('./routes/admin'));

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => console.log('API on port ' + process.env.PORT));
}).catch((e) => console.error('DB error', e));