const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Shipment = require('../models/Shipment');
const { protect, allow } = require('../middleware/auth');
const { recordEvent, getHistory } = require('../services/blockchain');

router.use(protect);

const populateOpts = [
  { path: 'farmer', select: 'name phone village' },
  { path: 'transporter', select: 'name phone' }
];

// Vehicle capacity rules (must match frontend/src/data/vehicles.js)
const VEHICLES = [
  { name: 'Mini Truck', maxKg: 750, base: 300, perKg: 4 },
  { name: 'Pickup Truck', maxKg: 1500, base: 500, perKg: 3.5 },
  { name: 'Refrigerated Truck', maxKg: 3000, base: 1000, perKg: 5 },
  { name: 'Tractor Trailer', maxKg: Infinity, base: 1500, perKg: 2.5 }
];

// Farmer creates a transport request (chain first, then database)
router.post('/', allow('farmer'),
  body('produce').trim().notEmpty(),
  body('quantityKg').isFloat({ min: 1 }),
  body('pickupLocation').trim().notEmpty(),
  body('dropLocation').trim().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { produce, quantityKg, pickupLocation, dropLocation } = req.body;
      const shipment = new Shipment({ farmer: req.user.id, produce, quantityKg, pickupLocation, dropLocation });
      const hash = await recordEvent(shipment._id, 'Created', req.user.id, 'Request created');
      shipment.txHashes.push(hash);
      await shipment.save();
      res.status(201).json(shipment);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Could not create shipment. Is the blockchain node running?' });
    }
  });

// List shipments depending on role
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'farmer') filter = { farmer: req.user.id };
    else if (req.user.role === 'transporter') {
      filter = { $or: [{ status: 'Created', transporter: null }, { transporter: req.user.id }] };
    }
    const list = await Shipment.find(filter).populate(populateOpts).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Could not load shipments' });
  }
});

// Shared status-change logic for accept, pickup and deliver
const transition = (from, to, note) => async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    if (shipment.status !== from) {
      return res.status(400).json({ message: 'Shipment must be ' + from + ' (currently ' + shipment.status + ')' });
    }
    let eventNote = note;
    if (to === 'Accepted') {
      const vehicle = VEHICLES.find((v) => v.name === req.body?.vehicleType);
      if (!vehicle) {
        return res.status(400).json({ message: 'Please choose a vehicle' });
      }
      if (shipment.quantityKg > vehicle.maxKg) {
        return res.status(400).json({
          message: vehicle.name + ' cannot carry ' + shipment.quantityKg + ' kg (max ' + vehicle.maxKg + ' kg)'
        });
      }
      shipment.transporter = req.user.id;
      shipment.vehicleType = vehicle.name;
      shipment.price = Math.round(vehicle.base + vehicle.perKg * shipment.quantityKg);
      eventNote = note + ' using ' + vehicle.name;
    } else if (String(shipment.transporter) !== req.user.id) {
      return res.status(403).json({ message: 'This shipment is not assigned to you' });
    }
    const hash = await recordEvent(shipment._id, to, req.user.id, eventNote);
    shipment.status = to;
    shipment.txHashes.push(hash);
    await shipment.save();
    res.json(shipment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Action failed. Is the blockchain node running?' });
  }
};

router.patch('/:id/accept', allow('transporter'), transition('Created', 'Accepted', 'Accepted by transporter'));
router.patch('/:id/pickup', allow('transporter'), transition('Accepted', 'PickedUp', 'Produce picked up'));
router.patch('/:id/deliver', allow('transporter'), transition('PickedUp', 'Delivered', 'Delivered at motorable road'));

// Shipment details plus on-chain history
router.get('/:id/history', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate(populateOpts);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    const u = req.user;
    const farmerId = String(shipment.farmer._id);
    const transporterId = shipment.transporter ? String(shipment.transporter._id) : null;
    if (u.role !== 'admin' && u.id !== farmerId && u.id !== transporterId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const history = await getHistory(shipment._id);
    res.json({ shipment, history });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not load history' });
  }
});

module.exports = router;