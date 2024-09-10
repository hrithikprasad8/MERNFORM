const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    studentPersonalInfo: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
      gender: { type: String, required: true },
      dob: { type: Date, required: true },
      mobile: {
        type: String,
        required: true,
        maxlength: 13,
        match: [
          /^\+91[0-9]{10}$/,
          "Please enter a valid mobile number (e.g. +91xxxxxxxxxx)",
        ],
      },
      email: { type: String, required: true, unique: true },
    },
    address: {
      address1: { type: String, required: true },
      address2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true, maxlength: 6 },
    },
    contacts: {
      primary: {
        relation: { type: String, required: true },
        name: { type: String, required: true },
        phone: {
          type: String,
          required: true,
          maxlength: 13,
          match: [
            /^\+91[0-9]{10}$/,
            "Please enter a valid mobile number (e.g. +91xxxxxxxxxx)",
          ],
        },
        email: { type: String, required: true },
      },
      secondary: {
        relation: { type: String },
        name: { type: String },
        phone: {
          type: String,
          maxlength: 13,
          match: [
            /^\+91[0-9]{10}$/,
            "Please enter a valid mobile number (e.g. +91xxxxxxxxxx)",
          ],
        },
        email: { type: String },
      },
    },
    vocation: { type: String, required: true },
    class: { type: String },
    institution: { type: String },
    photo: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
