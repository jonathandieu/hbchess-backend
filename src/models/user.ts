import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  emailToken: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);
