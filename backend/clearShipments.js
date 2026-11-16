require('dotenv').config();
const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const res = await Shipment.deleteMany({});
  console.log(`Cleared ${res.deletedCount} shipment(s). User accounts were kept safe.`);
  process.exit(0);
})();