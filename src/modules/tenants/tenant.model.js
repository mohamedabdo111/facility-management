import mongoose from "mongoose";

const schema = mongoose.Schema;
const model = mongoose.model;

const TenantSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isActive: Boolean,
  },
  { timestamps: true },
);

const TenantModel = model("Tenant", TenantSchema);

export default TenantModel;
