import mongoose from "mongoose";

const opts = { toJSON: { virtuals: true } };
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
    image: {
      type: String,
      default: null,
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
  { timestamps: true, ...opts },
);

UserSchema.virtual("imageUrl").get(function () {
  if (!this.image) {
    return null;
  }
  return `${process.env.APP_URL}/uploads/${this.image}`;
});

const UserModel = model("User", UserSchema);

export default UserModel;
