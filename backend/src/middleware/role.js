const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const requireFaculty = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const requireAdminOrFaculty = requireFaculty;

module.exports = {
  requireAdmin,
  requireFaculty,
  requireAdminOrFaculty
};
