require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const DEMO_USERS = [
  { name: 'Admin', email: 'admin@agri.com', pass: 'Admin@123', role: 'admin' },
  { name: 'Ramesh (Demo Farmer)', email: 'farmer@agri.com', pass: 'Farmer@123', role: 'farmer', phone: '9876543210', village: 'Kandukur Farm' },
  { name: 'Suresh (Demo Transporter)', email: 'transporter@agri.com', pass: 'Transporter@123', role: 'transporter', phone: '9876501234' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const u of DEMO_USERS) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`${u.role} already exists: ${u.email}`);
    } else {
      await User.create({
        name: u.name,
        email: u.email,
        password: await bcrypt.hash(u.pass, 10),
        role: u.role,
        phone: u.phone,
        village: u.village
      });
      console.log(`${u.role} created: ${u.email} / ${u.pass}`);
    }
  }
  process.exit(0);
})();