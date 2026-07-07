import mongoose from "mongoose";

const schema = mongoose.Schema;
const model = mongoose.model;

const UserSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
    },
    role: {
      type: String,
      required: true,
      enum: ["Owner", "Admin", "Technician", "Supervisor"],
      default: "Technician",
    },
    tenantId: {
      type: schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// mogoose middleware to filter out deleted users
UserSchema.pre("/^find/", function(next) {
  this.where({ isDeleted: false, deletedAt: null });
  next();
});

const UserModel = model("User", UserSchema);

export default UserModel;
