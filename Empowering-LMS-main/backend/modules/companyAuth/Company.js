const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const OTPSchema = new mongoose.Schema({
  otpCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Number,
    required: true,
  },
});

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: OTPSchema,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  lastVisit: {
    type: Date,
  },
});

const CompanySchema = new mongoose.Schema(
  {
    account: {
      type: AccountSchema,
      required: true,
    },
    // Subscription Fields
    subscription: {
      status: {
        type: String,
        enum: ["active", "inactive", "past_due", "canceled", "unpaid"],
        default: "inactive",
      },
      planType: {
        type: String,
        enum: ["monthly", "yearly", "custom"],
      },
      planDurationMonths: {
        type: Number, // For custom plans
      },
      startDate: {
        type: Date,
      },
      expiresAt: {
        type: Date,
      },
      stripeCustomerId: {
        type: String,
      },
      stripeSubscriptionId: {
        type: String,
      },
      stripeSessionId: {
        type: String,
      },
      paymentCompleted: {
        type: Boolean,
        default: false,
      },
      hasUsedTrial: {
        type: Boolean,
        default: false,
      },
    },
    profile: {
      description: { type: String, default: "" },
      industry: { type: String, default: "" },
      country: { type: String, default: "" },
      contactNo: { type: String, default: "" },
      address: { type: String, default: "" },
      registrationNo: { type: String, default: "" },
      logo: { type: String, default: "" },
      slug: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined for existing records until backfilled
        trim: true,
        lowercase: true,
      },
      manualAccessStatus: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Encryption logic moved to controller
// CompanySchema.pre("save", async function (next) { ... });

module.exports = mongoose.model("Company", CompanySchema);
