export const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.toLowerCase().includes(req.user?.role.toLowerCase())) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
    next();
  };
};
