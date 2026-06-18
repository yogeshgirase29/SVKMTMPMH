const isAdminAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Access denied. Unauthorized. Please log in as Admin.'
  });
};

module.exports = {
  isAdminAuthenticated
};
