const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const sign = (u) => jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['farmer', 'transporter']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    if (await User.findOne({ email: req.body.email })) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hash });
    res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, role: user.role } });
  });

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ token: sign(user), user: { id: user._id, name: user.name, role: user.role } });
});

module.exports = router;