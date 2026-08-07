export const allowTo = (...roles) => {
  const normalizedRoles = roles.map((role) => role.toLowerCase());
  return (req, res, next) => {
    if (!normalizedRoles.includes(req.user?.role.toLowerCase())) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
    next();
  };
};
