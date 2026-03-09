const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
  try {
    const { role, department, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (department) where.department = department;
    if (search) {
      where.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(where).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash: hashedPassword, role, department });
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, 
      { role, department, isActive }, 
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
