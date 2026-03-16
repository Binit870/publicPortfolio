import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // prevents password returning by default
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
      
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    permissions: {
      manageProfile: { type: Boolean, default: true },
      manageGallery: { type: Boolean, default: true },
      manageEvents: { type: Boolean, default: true },
      manageUpdates: { type: Boolean, default: true },
      manageMessages: { type: Boolean, default: true },
      manageSettings: { type: Boolean, default: true },
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// performance indexes

userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);