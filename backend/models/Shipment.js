const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  produce: { type: String, required: true },
  quantityKg: { type: Number, required: true, min: 1 },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  vehicleType: { type: String },
  price: { type: Number, default: null },
  status: { type: String, enum: ['Created', 'Accepted', 'PickedUp', 'Delivered'],default: 'Created' },
  txHashes: [String]
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);