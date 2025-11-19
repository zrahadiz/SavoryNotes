const { Schema } = require("mongoose");
const { hashPassword } = require("../../utils/password");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "public"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hashPassword(this.password);

  next();
});

module.exports = userSchema;
