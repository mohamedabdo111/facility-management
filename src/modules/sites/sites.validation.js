import { check } from "express-validator";
import { validationMiddleWare } from "../../middleware/validation.js";
import SiteModel from "./sites.model.js";

export const createSiteValidation = [
    check("name").notEmpty().withMessage("Name is required")
    .custom(async(value, { req }) => {
        const site = await SiteModel.findOne({ name: value, tenantId: req.user.tenantId });
        if (site) {
            throw new Error("Site already exists");
        }
        return true;
    }),
    check("description").notEmpty().withMessage("Description is required"),
    check("email").notEmpty().withMessage("Email is required"),
    check("phone").notEmpty().withMessage("Phone is required"),
    check("address").notEmpty().withMessage("Address is required"),
    check("address.city").notEmpty().withMessage("City is required"),
    check("address.state").notEmpty().withMessage("State is required"),
    check("address.country").notEmpty().withMessage("Country is required"),
    check("address.postalCode").notEmpty().withMessage("Postal code is required"),
    check("address.street").notEmpty().withMessage("Street is required"),
    check("address.coordinates.latitude").notEmpty().withMessage("Latitude is required"),
    check("address.coordinates.longitude").notEmpty().withMessage("Longitude is required"),
    
    validationMiddleWare,
]

export const updateSiteValidation = [
    check("name").notEmpty().withMessage("Name is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("email").notEmpty().withMessage("Email is required"),
    check("phone").notEmpty().withMessage("Phone is required"),
    check("address").notEmpty().withMessage("Address is required"),
    check("address.city").notEmpty().withMessage("City is required"),
    check("address.state").notEmpty().withMessage("State is required"),
    check("address.country").notEmpty().withMessage("Country is required"),
    check("address.postalCode").notEmpty().withMessage("Postal code is required"),
    check("address.street").notEmpty().withMessage("Street is required"),
    check("address.coordinates.latitude").notEmpty().withMessage("Latitude is required"),
    check("address.coordinates.longitude").notEmpty().withMessage("Longitude is required"),
    validationMiddleWare,
]