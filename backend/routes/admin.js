const router = require('express').Router();
const User = require('../models/User');
const Shipment = require('../models/Shipment');
const { protect, allow } = require('../middleware/auth');

// All admin routes require a logged-in admin
router.use(protect, allow('admin'));

// GET /api/admin/stats - overview numbers for the dashboard
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalFarmers, totalTransporters, totalShipments, deliveredShipments] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'transporter' }),
      Shipment.countDocuments({}),
      Shipment.countDocuments({ status: 'Delivered' }),
    ]);
    res.json({ totalUsers, totalFarmers, totalTransporters, totalShipments, deliveredShipments });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not load stats' });
  }
});

// GET /api/admin/users - list all users (excluding password field)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not load users' });
  }
});

// DELETE /api/admin/users/:id - remove a user (cannot delete an admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not delete user' });
  }
});

module.exports = router;