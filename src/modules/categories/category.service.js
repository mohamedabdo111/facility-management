import getAllMethod, { getOneMethod, updateMethod } from "../../handler/handlerFactory.js";
import CategoryModel from "./category.model.js";

export const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await CategoryModel.create({ name, tenantId: req.user.tenantId });
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
    });
};

export const getAllCategories = getAllMethod(CategoryModel, "Categories");
export const getCategory = getOneMethod(CategoryModel, "Category");
export const updateCategory = updateMethod(CategoryModel, "Category");
