const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const LearnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // unique: true, // Removed global uniqueness
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    otp: {
      otpCode: {
        type: String,
        default: null,
      },
      expiresAt: {
        type: Number,
        default: null,
      },
    },
    contactNo: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastVisit: {
      type: Date,
      default: null,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  },
);

LearnerSchema.index({ email: 1, company: 1 }, { unique: true });

LearnerSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Learners", LearnerSchema);
