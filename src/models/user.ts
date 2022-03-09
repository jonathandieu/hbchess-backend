import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email address is required"],
    match: [
      /^.+@.+\..+$/,
      "Please fill a valid email address"
    ]
  },
  username: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  emailToken: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
