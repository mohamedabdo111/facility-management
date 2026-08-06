import getAllMethod, {
  deleteMethod,
  getOneMethod,
} from "../../handler/handlerFactory.js";
import SiteModel from "./sites.model.js";

export const createSite = async (req, res) => {
  const { name, description, email, phone, address, code, image } = req.body;

  const site = await SiteModel.create({
    name,
    description,
    email,
    phone,
    address,
    code,
    image,
    tenantId: req.user.tenantId,
  });
  return res.status(201).json({
    success: true,
    message: "Site created successfully",
    data: site,
  });
};

export const getSites = getAllMethod(SiteModel, "sites");

export const getSiteById = getOneMethod(SiteModel, "site");

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

export const deleteSite = deleteMethod(SiteModel, "site");
