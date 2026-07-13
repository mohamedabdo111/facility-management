import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: [true, "Tenant ID is required"],
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
    
});

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;