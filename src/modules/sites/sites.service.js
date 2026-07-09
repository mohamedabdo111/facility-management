import SiteModel from "./sites.model.js";

export const createSite = async (req, res) => {
  const { name, description, email, phone, address, code } = req.body;
  const site = await SiteModel.create({
    name,
    description,
    email,
    phone,
    address,
    code,
    tenantId: req.user.tenantId,
  });
  return res.status(201).json({
    success: true,
    message: "Site created successfully",
    data: site,
  });
};

export const getSites = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  const filter = {
    tenantId: req.user.tenantId,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ],
  };
  const sites = await SiteModel.find(filter)
    .lean()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await SiteModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  return res.status(200).json({
    success: true,
    message: "Sites fetched successfully",
    data: sites,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  });
};

export const getSiteById = async (req, res) => {
  const site = await SiteModel.findOne({
    _id: req.params.id,
    tenantId: req.user.tenantId,
  });
  if (!site) {
    return res.status(404).json({
      success: false,
      message: "Site not found",
      data: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Site fetched successfully",
    data: site,
  });
};

export const updateSite = async (req, res) => {
  const { name, description, email, phone, address } = req.body;
  const site = await SiteModel.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    { name, description, email, phone, address },
    { new: true },
  );
  if (!site) {
    return res.status(404).json({
      success: false,
      message: "Site not found",
      data: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Site updated successfully",
    data: site,
  });
};

export const deleteSite = async (req, res) => {
  const site = await SiteModel.findOneAndUpdate(
    {
      _id: req.params.id,
      tenantId: req.user.tenantId,
    },
    { isDeleted: true, deletedAt: new Date() },
    { new: true },
  );
  if (!site) {
    return res.status(404).json({
      success: false,
      message: "Site not found",
      data: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Site deleted successfully",
  });
};
