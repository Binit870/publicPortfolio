import ApiError from "../utils/ApiError.js";

export const requireAdmin = (req, res, next) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Access denied - Admins only");
  }
  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  if (req.user.role !== "superadmin") {
    throw new ApiError(403, "Access denied - Super Admins only");
  }
  next();
};

export const checkPermission = (permission) => (req, res, next) => {
  if (req.user.role === "superadmin") return next();
  if (!req.user.permissions?.[permission]) {
    throw new ApiError(403, `Access denied - No permission: ${permission}`);
  }
  next();
};