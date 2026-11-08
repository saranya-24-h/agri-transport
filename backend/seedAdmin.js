require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@agri.com';
  if (await User.findOne({ email })) {
    console.log('Admin already exists');
    process.exit(0);
  }
  await User.create({ name: 'Admin', email, password: await bcrypt.hash('Admin@123', 10), role: 'admin' });
  console.log('Admin created: admin@agri.com / Admin@123');
  process.exit(0);
})();